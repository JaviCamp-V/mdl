'use server';

import { revalidateTag, unstable_cache } from 'next/cache';
import AccessLevel from '@/features/auth/types/enums/AccessLevel';
import { getContentDetails } from '@/features/media/service/tmdbService';
import { getTitle } from '@/features/media/utils/tmdbUtils';
import withAuthMiddleware from '@/middleware/withAuthMiddleware';
import mdlApiClient from '@/clients/mdlApiClient';
import ErrorResponse from '@/types/common/ErrorResponse';
import GenericResponse from '@/types/common/GenericResponse';
import MediaType from '@/types/enums/IMediaType';
import { getSession } from '@/utils/authUtils';
import { formatStringDate } from '@/utils/formatters';
import { generateErrorResponse } from '@/utils/handleError';
import logger from '@/utils/logger';
import ReviewType from '../types/enums/ReviewType';
import { ExtendOverallReviewWithMedia } from '../types/interfaces/ExtendReviewResponse';
import ReviewHelpfulData from '../types/interfaces/ReviewHelpfulData';
import { CreateEpisodeReview, CreateOverallReview } from '../types/interfaces/ReviewRequest';
import { EpisodeReview, OverallReview } from '../types/interfaces/ReviewResponse';

const endpoints = {
  user: {
    addReview: 'user/reviews',
    deleteReview: 'user/reviews/:id',
    markHelpful: 'user/reviews/:id/helpful'
  },
  public: {
    getUserReviews: 'reviews',
    getRecentReviews: 'reviews/updates',
    getMediaOverallReviews: 'reviews/:mediaType/:mediaId',
    getMediaEpisodeReviews: 'reviews/:mediaId/:season/:episode',
    getReview: 'reviews/:id',
    getReviewHelpful: 'reviews/:id/helpful'
  }
};

const createReview = async <T extends ReviewType>(
  reviewType: T,
  request: T extends ReviewType.EPISODE ? CreateEpisodeReview : CreateOverallReview
): Promise<GenericResponse | ErrorResponse> => {
  try {
    logger.info('Creating review with: %s %s', request.mediaType, request.mediaId);
    const endpoint = endpoints.user.addReview;
    const body = { ...request, reviewType, mediaType: request.mediaType.toUpperCase() };
    const response = await mdlApiClient.post<CreateEpisodeReview | CreateOverallReview, GenericResponse>(
      endpoint,
      body
    );
    const session = await getSession();
    if (session?.user?.username) revalidateTag(`user-reviews-${session.user.username}-${reviewType}`);
    revalidateTag('recent-reviews');
    if (reviewType === ReviewType.OVERALL) {
      revalidateTag(`overall-reviews-${request.mediaType}-${request.mediaId}`);
    } else {
      const episodeReview = request as CreateEpisodeReview;
      revalidateTag(`episode-reviews-${request.mediaId}-${episodeReview.season}-${episodeReview.episode}`);
    }

    return response;
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    const status = error?.response?.status ?? 408;
    logger.error(`Error creating review: ${error?.message}`);
    return error.response.data ?? generateErrorResponse(status, message);
  }
};

const deleteReview = async (
  mediaType: MediaType,
  mediaId: number,
  reviewType: ReviewType,
  id: number
): Promise<GenericResponse | ErrorResponse> => {
  try {
    logger.info('Deleting review with: %s', id);
    const endpoint = endpoints.user.deleteReview.replace(':id', id.toString());
    const response = await mdlApiClient.del<GenericResponse>(endpoint);
    revalidateTag('recent-reviews');
    if (reviewType === ReviewType.OVERALL) {
      revalidateTag(`overall-reviews-${mediaType}-${mediaId}`);
    }
    // TODO: revalidate episode reviews and user reviews
    return response;
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    const status = error?.response?.status ?? 408;
    logger.error(`Error deleting review: ${error?.message}`);
    return error.response.data ?? generateErrorResponse(status, message);
  }
};

const markReviewHelpful = async (id: number, isHelpful: boolean): Promise<GenericResponse | ErrorResponse> => {
  try {
    logger.info('Marking review helpful with: %s', id);
    const endpoint = endpoints.user.markHelpful.replace(':id', id.toString());
    const params = new URLSearchParams({ isHelpful: Boolean(isHelpful)?.toString() });
    const session = await getSession();
    const response = await mdlApiClient.post<null, GenericResponse>(endpoint, null, params);
    revalidateTag(`review-helpful-${id}`);
    return response;
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    const status = error?.response?.status ?? 408;
    logger.error(`Error marking review helpful: ${error?.message}`);
    return error.response.data ?? generateErrorResponse(status, message);
  }
};

const removedHelpfulRating = async (id: number): Promise<GenericResponse | ErrorResponse> => {
  try {
    logger.info('Removing helpful rating with: %s', id);
    const endpoint = endpoints.user.markHelpful.replace(':id', id.toString());
    const response = await mdlApiClient.del<GenericResponse>(endpoint);
    revalidateTag(`review-helpful-${id}`);
    return response;
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    const status = error?.response?.status ?? 408;
    logger.error(`Error removing helpful rating: ${error?.message}`);
    return error.response.data ?? generateErrorResponse(status, message);
  }
};

const authCreateReview = withAuthMiddleware(createReview, AccessLevel.MEMBER);
const authDeleteReview = withAuthMiddleware(deleteReview, AccessLevel.MEMBER);
const authMarkReviewHelpful = withAuthMiddleware(markReviewHelpful, AccessLevel.MEMBER);
const authRemoveHelpfulRating = withAuthMiddleware(removedHelpfulRating, AccessLevel.MEMBER);

const getMediaOverallReviews = async (
  mediaType: MediaType.tv | MediaType.movie,
  mediaId: number
): Promise<OverallReview[]> => {
  try {
    logger.info('Fetching overall reviews with mediaType: %s %s', mediaType, mediaId);

    const endpoint = endpoints.public.getMediaOverallReviews
      .replace(':mediaType', mediaType.toString().toUpperCase())
      .replace(':mediaId', mediaId.toString());
    const response = await mdlApiClient.get<OverallReview[]>(endpoint);
    return response.sort((a, b) => formatStringDate(b.createdAt).getTime() - formatStringDate(a.createdAt).getTime());
  } catch (error: any) {
    logger.error(`Error fetching overall reviews: ${error?.message}`);
    return [];
  }
};

const getMediaEpisodeReviews = async (
  mediaId: number,
  season: number,
  episode: number
): Promise<EpisodeReview[] | ErrorResponse> => {
  try {
    logger.info('Fetching episode reviews with mediaId: %s season: %s episode %s', mediaId, season, episode);
    const endpoint = endpoints.public.getMediaEpisodeReviews
      .replace(':mediaId', mediaId.toString())
      .replace(':season', season.toString())
      .replace(':episode', episode.toString());
    return await mdlApiClient.get<EpisodeReview[]>(endpoint);
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    const status = error?.response?.status ?? 408;
    logger.error(`Error fetching episode reviews: ${error?.message}`);
    return error.response.data ?? generateErrorResponse(status, message);
  }
};

//not cached
const getReview = async (id: number): Promise<EpisodeReview | OverallReview | ErrorResponse> => {
  try {
    logger.info('Fetching review with id: %s', id);
    const endpoint = endpoints.public.getReview.replace(':id', id.toString());
    return await mdlApiClient.get<EpisodeReview | OverallReview>(endpoint);
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    const status = error?.response?.status ?? 408;
    logger.error(`Error fetching review: ${error?.message}`);
    return error.response.data ?? generateErrorResponse(status, message);
  }
};

const getReviewHelpful = async (id: number, userId?: number | null): Promise<ReviewHelpfulData> => {
  try {
    logger.info('Fetching helpful rating with id: %s', id);
    const endpoint = endpoints.public.getReviewHelpful.replace(':id', id.toString());
    const params = new URLSearchParams(userId ? { userId: userId?.toString() } : {});
    return await mdlApiClient.get<ReviewHelpfulData>(endpoint, params);
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    logger.error(`Error fetching helpful rating: ${message}`);
    return { numberOfHelpfulReviews: 0, numberOfUnhelpfulReviews: 0, isHelpful: null };
  }
};

const getRecentReviews = async (): Promise<ExtendOverallReviewWithMedia[]> => {
  try {
    logger.info('Fetching recent reviews');
    const endpoint = endpoints.public.getRecentReviews;
    const response = await mdlApiClient.get<OverallReview[]>(endpoint);
    const withMedia = await Promise.all(
      response.map(async (review) => {
        const type = review.mediaType.toLowerCase() as MediaType.tv | MediaType.movie;
        const details = await getContentDetails(type, review.mediaId);

        if (!details) return { ...review, poster_path: null, title: 'Unknown', origin: 'Unknown' };
        const title = getTitle({ ...details, media_type: type } as any);
        const country = details.origin_country.length ? details.origin_country[0] : 'Unknown';
        return { ...review, poster_path: details.poster_path, title, origin: country };
      })
    );
    return withMedia;
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    logger.error(`Error fetching recent reviews: ${message}`);
    return [];
  }
};

const getUserReviews = async (username: string, reviewType: ReviewType): Promise<OverallReview[] | ErrorResponse> => {
  try {
    logger.info('Fetching user reviews with username: %s reviewType: %s', username, reviewType);
    const endpoint = endpoints.public.getUserReviews;
    const params = new URLSearchParams({ username, reviewType: reviewType.toString() });
    return await mdlApiClient.get<OverallReview[]>(endpoint, params);
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    const status = error?.response?.status ?? 408;
    logger.error(`Error fetching user reviews: ${error?.message}`);
    return error.response.data ?? generateErrorResponse(status, message);
  }
};

const cacheGetMediaOverallReviews = async (mediaType: MediaType.tv | MediaType.movie, mediaId: number) => {
  try {
    const getCached = unstable_cache(getMediaOverallReviews, [], {
      tags: [`overall-reviews-${mediaType}-${mediaId}`]
    });

    return await getCached(mediaType, mediaId);
  } catch (error: any) {
    logger.error('Error fetching comments: %s', error.message);
    return [];
  }
};

const cacheGetMediaEpisodeReviews = async (mediaId: number, season: number, episode: number) => {
  try {
    const getCached = unstable_cache(getMediaEpisodeReviews, [], {
      tags: [`episode-reviews-${mediaId}-${season}-${episode}`]
    });
    return await getCached(mediaId, season, episode);
  } catch (error: any) {
    logger.error('Error fetching comments: %s', error.message);
    return generateErrorResponse(500, error.message);
  }
};

const cacheGetReview = async (id: number) => {
  try {
    const getCached = unstable_cache(getReview, [], {
      tags: [`review-${id}`]
    });
    return await getCached(id);
  } catch (error: any) {
    logger.error('Error fetching comments: %s', error.message);
    return generateErrorResponse(500, error.message);
  }
};

const cacheGetReviewHelpful = async (id: number) => {
  try {
    const getCached = unstable_cache(getReviewHelpful, [], {
      tags: [`review-helpful-${id}`]
    });
    const session = await getSession();
    const userId = session?.user?.userId;
    return await getCached(id, userId);
  } catch (error: any) {
    logger.error('Error fetching comments: %s', error.message);
    return { numberOfHelpfulReviews: 0, numberOfUnhelpfulReviews: 0, isHelpful: null };
  }
};

const cacheGetRecentReviews = unstable_cache(getRecentReviews, [], {
  tags: ['recent-reviews'],
  revalidate: 60
});
const cacheGetUserReviews = async (username: string, reviewType: ReviewType) => {
  try {
    const getCached = unstable_cache(getUserReviews, [], {
      tags: [`user-reviews-${username}-${reviewType}`]
    });
    return await getCached(username, reviewType);
  } catch (error: any) {
    logger.error('Error fetching comments: %s', error.message);
    return generateErrorResponse(500, error.message);
  }
};

export {
  authCreateReview as createReview,
  authDeleteReview as deleteReview,
  authMarkReviewHelpful as markReviewHelpful,
  authRemoveHelpfulRating as removedHelpfulRating,
  cacheGetMediaOverallReviews as getMediaOverallReviews,
  cacheGetMediaEpisodeReviews as getMediaEpisodeReviews,
  cacheGetReview as getReview,
  cacheGetReviewHelpful as getReviewHelpful,
  cacheGetRecentReviews as getRecentReviews,
  cacheGetUserReviews as getUserReviews
};
