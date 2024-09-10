'use server';

import { unstable_cache } from 'next/cache';
import mdlApiClient from '@/clients/mdlApiClient';
import ErrorResponse from '@/types/common/ErrorResponse';
import MediaType from '@/types/enums/IMediaType';
import { getSession } from '@/utils/authUtils';
import handleServerError from '@/utils/handleServerError';
import logger from '@/utils/logger';
import { revalidate } from '@/libs/common';
import ReviewType from '../types/enums/ReviewType';
import ReviewHelpfulData, { HelpfulRating } from '../types/interfaces/ReviewHelpfulData';
import { EpisodeReview, OverallReview } from '../types/interfaces/ReviewResponse';
import { reviewViewEndpoints as endpoints } from './endpoints';

const getMediaOverallReviews = async (
  mediaType: MediaType.tv | MediaType.movie,
  mediaId: number
): Promise<OverallReview[]> => {
  try {
    logger.info('Fetching overall reviews with mediaType: %s %s', mediaType, mediaId);
    const endpointTemplate = endpoints.getMediaOverallReviews.endpoint;
    const endpoint = endpointTemplate
      .replace(':mediaType', mediaType.toString().toUpperCase())
      .replace(':mediaId', mediaId.toString());
    const response = await mdlApiClient.get<OverallReview[]>(endpoint);
    return response;
  } catch (error: any) {
    handleServerError(error, 'fetching overall reviews');
    return [];
  }
};

const getUserOverallReview = async (
  mediaType: MediaType.tv | MediaType.movie,
  mediaId: number,
  userId: number
): Promise<OverallReview | null> => {
  try {
    logger.info('Fetching user overall review with mediaType: %s mediaId: %s userId: %s', mediaType, mediaId, userId);
    const endpointTemplate = endpoints.getUserOverallReview.endpoint;
    const endpoint = endpointTemplate
      .replace(':mediaType', mediaType.toString().toUpperCase())
      .replace(':mediaId', mediaId.toString())
      .replace(':userId', userId.toString());
    return await mdlApiClient.get<OverallReview>(endpoint);
  } catch (error: any) {
    handleServerError(error, 'fetching user overall review');
    return null;
  }
};

const getMediaEpisodeReviews = async (mediaId: number, season: number, episode: number): Promise<EpisodeReview[]> => {
  try {
    logger.info('Fetching episode reviews with mediaId: %s season: %s episode %s', mediaId, season, episode);
    const endpointTemplate = endpoints.getMediaEpisodeReviews.endpoint;
    const endpoint = endpointTemplate
      .replace(':mediaId', mediaId.toString())
      .replace(':season', season.toString())
      .replace(':episode', episode.toString());
    const response = await mdlApiClient.get<EpisodeReview[]>(endpoint);
    return response;
  } catch (error: any) {
    handleServerError(error, 'fetching episode reviews');
    return [];
  }
};

const getUserEpisodeReview = async (mediaId: number, season: number, episode: number, userId: number) => {
  const endpointTemplate = endpoints.getUserEpisodeReview.endpoint;
  try {
    logger.info(
      'Fetching user episode review with mediaId: %s season: %s episode %s userId: %s',
      mediaId,
      season,
      episode,
      userId
    );
    const endpoint = endpointTemplate
      .replace(':mediaId', mediaId.toString())
      .replace(':season', season.toString())
      .replace(':episode', episode.toString())
      .replace(':userId', userId.toString());
    return await mdlApiClient.get<EpisodeReview>(endpoint);
  } catch (error: any) {
    handleServerError(error, 'fetching user episode review');
    return null;
  }
};

const getReview = async (id: number): Promise<EpisodeReview | OverallReview | null> => {
  const endpointTemplate = endpoints.getReview.endpoint;
  try {
    logger.info('Fetching review with id: %s', id);
    const endpoint = endpointTemplate.replace(':id', id.toString());
    return await mdlApiClient.get<EpisodeReview | OverallReview>(endpoint);
  } catch (error: any) {
    handleServerError(error, `fetching review with id: ${id}`);
    return null;
  }
};

const getReviewHelpful = async (id: number): Promise<ReviewHelpfulData> => {
  const endpointTemplate = endpoints.getReviewHelpful.endpoint;
  try {
    logger.info('Fetching helpful rating with id: %s', id);
    const endpoint = endpointTemplate.replace(':id', id.toString());
    return await mdlApiClient.get<ReviewHelpfulData>(endpoint);
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    logger.error(`Error fetching helpful rating: ${message}`);
    return { numberOfHelpfulReviews: 0, numberOfUnhelpfulReviews: 0 };
  }
};

const getUserReviewHelpfulRating = async (id: number, userId: number): Promise<HelpfulRating | null> => {
  const endpointTemplate = endpoints.getUserReviewHelpfulRating.endpoint;
  try {
    logger.info('Fetching helpful rating with id: %s userId: %s', id, userId);
    const endpoint = endpointTemplate.replace(':id', id.toString()).replace(':userId', userId.toString());
    const response = await mdlApiClient.get<HelpfulRating>(endpoint);
    return response;
  } catch (error: any) {
    handleServerError(error, 'fetching helpful rating');
    return null;
  }
};
const getRecentReviews = async (): Promise<OverallReview[]> => {
  const { endpoint } = endpoints.getRecentReviews;
  try {
    logger.info('Fetching recent reviews');
    const response = await mdlApiClient.get<OverallReview[]>(endpoint);
    return response;
  } catch (error: any) {
    handleServerError(error, 'fetching recent reviews');
    return [];
  }
};

const getUserReviews = async <T extends ReviewType>(
  userId: number,
  reviewType: T
): Promise<T extends ReviewType.EPISODE ? EpisodeReview[] | ErrorResponse : OverallReview[] | ErrorResponse> => {
  try {
    logger.info('Fetching user reviews with user: %s reviewType: %s', userId, reviewType);
    const endpointTemplate = endpoints.getUserReviews.endpoint;
    const endpoint = endpointTemplate.replace(':userId', userId.toString());
    const params = new URLSearchParams({ reviewType: reviewType.toString() });
    return await mdlApiClient.get<T extends ReviewType.EPISODE ? EpisodeReview[] : OverallReview[]>(endpoint, params);
  } catch (error: any) {
    return handleServerError(error, 'fetching user reviews');
  }
};

const cacheGetMediaOverallReviews = async (mediaType: MediaType.tv | MediaType.movie, mediaId: number) => {
  try {
    const tags = endpoints.getMediaOverallReviews.tags;
    const getCached = unstable_cache(getMediaOverallReviews, [], {
      tags: tags.map((tag) => tag?.replace('{mediaType}', mediaType).replace('{mediaId}', mediaId.toString())),
      revalidate
    });

    return await getCached(mediaType, mediaId);
  } catch (error: any) {
    handleServerError(error, `fetching get ${mediaType} ${mediaId} overall reviews  from cache`);
    return [];
  }
};

const cacheGetMediaEpisodeReviews = async (mediaId: number, season: number, episode: number) => {
  try {
    const tags = endpoints.getMediaEpisodeReviews.tags;
    const tagWithValues = tags.map((tag) =>
      tag
        .replace('{mediaId}', mediaId.toString())
        .replace('{season}', season.toString())
        .replace('{episode}', episode.toString())
    );
    const getCached = unstable_cache(getMediaEpisodeReviews, [], {
      tags: tagWithValues,
      revalidate
    });
    return await getCached(mediaId, season, episode);
  } catch (error: any) {
    handleServerError(error, `fetching tv ${mediaId} ${season} ${episode} episode review from cache`);
    return [];
  }
};

const cacheGetReview = async (id: number) => {
  try {
    const tags = endpoints.getReview.tags;
    const getCached = unstable_cache(getReview, [], {
      tags: tags.map((tag) => tag.replace('{id}', id.toString())),
      revalidate
    });
    return await getCached(id);
  } catch (error: any) {
    handleServerError(error, 'fetching review from cache');
    return null;
  }
};

const cacheGetReviewHelpful = async (id: number) => {
  try {
    const tags = endpoints.getReviewHelpful.tags;
    const getCached = unstable_cache(getReviewHelpful, [], {
      tags: tags.map((tag) => tag.replace('{id}', id.toString())),
      revalidate
    });
    return await getCached(id);
  } catch (error: any) {
    handleServerError(error, 'fetching review helpful rating from cache');
    return { numberOfHelpfulReviews: 0, numberOfUnhelpfulReviews: 0, isHelpful: null };
  }
};

const cacheGetUserReviewHelpfulRating = async (id: number) => {
  try {
    const tags = endpoints.getUserReviewHelpfulRating.tags;
    const session = await getSession();
    const userId = session?.user?.userId;
    if (!userId) return null;
    const getCached = unstable_cache(getUserReviewHelpfulRating, [], {
      tags: tags.map((tag) => tag.replace('{id}', id.toString()).replace('{userId}', userId.toString())),
      revalidate
    });
    return await getCached(id, userId);
  } catch (error: any) {
    handleServerError(error, 'fetching user review helpful rating from cache');
    return null;
  }
};

const cacheGetRecentReviews = unstable_cache(getRecentReviews, [], {
  tags: endpoints.getRecentReviews.tags,
  revalidate
});

const cacheGetUserReviews = async <T extends ReviewType>(
  userId: number,
  reviewType: T
): Promise<T extends ReviewType.EPISODE ? EpisodeReview[] | ErrorResponse : OverallReview[] | ErrorResponse> => {
  try {
    const tags = endpoints.getUserReviews.tags;
    const getCached = unstable_cache(getUserReviews, [], {
      tags: tags.map((tag) =>
        tag.replace('{userId}', userId.toString()).replace('{reviewType}', reviewType?.toString())
      ),
      revalidate
    });
    return await getCached(userId, reviewType);
  } catch (error: any) {
    return handleServerError(error, 'fetching user reviews from cache');
  }
};

const cacheGetUserOverallReview = async (mediaType: MediaType.tv | MediaType.movie, mediaId: number) => {
  try {
    const session = await getSession();
    const userId = session?.user?.userId;
    if (!userId) return null;
    const tags = endpoints.getUserOverallReview.tags;

    const getCached = unstable_cache(getUserOverallReview, [], {
      tags: tags.map((tag) =>
        tag
          .replace('{mediaType}', mediaType)
          .replace('{mediaId}', mediaId.toString())
          .replace('{userId}', userId.toString())
      ),
      revalidate
    });
    return await getCached(mediaType, mediaId, userId);
  } catch (error: any) {
    handleServerError(error, 'fetching user overall review from cache');
    return null;
  }
};

const cacheGetUserEpisodeReview = async (mediaId: number, season: number, episode: number) => {
  try {
    const session = await getSession();
    const userId = session?.user?.userId;
    if (!userId) return null;
    const tags = endpoints.getUserEpisodeReview.tags;
    const getCached = unstable_cache(getUserEpisodeReview, [], {
      tags: tags.map((tag) =>
        tag
          .replace('{mediaId}', mediaId.toString())
          .replace('{season}', season.toString())
          .replace('{episode}', episode.toString())
          .replace('{userId}', userId.toString())
      ),
      revalidate
    });
    return await getCached(mediaId, season, episode, userId);
  } catch (error: any) {
    handleServerError(error, 'fetching user episode review from cache');
    return null;
  }
};

export {
  cacheGetMediaOverallReviews as getMediaOverallReviews,
  cacheGetMediaEpisodeReviews as getMediaEpisodeReviews,
  cacheGetReview as getReview,
  getReview as unCachedGetReview,
  cacheGetReviewHelpful as getReviewHelpful,
  cacheGetUserReviewHelpfulRating as getUserReviewHelpfulRating,
  cacheGetRecentReviews as getRecentReviews,
  cacheGetUserReviews as getUserReviews,
  cacheGetUserOverallReview as getUserOverallReview,
  cacheGetUserEpisodeReview as getUserEpisodeReview
};
