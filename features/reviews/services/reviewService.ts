'use server';

import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import withAuthMiddleware from '@/middleware/withAuthMiddleware';
import { get } from 'http';
import mdlApiClient from '@/clients/mdlApiClient';
import AccessLevel from '@/types/Auth/AccessLevel';
import ErrorResponse from '@/types/common/ErrorResponse';
import GenericResponse from '@/types/common/GenericResponse';
import MediaType from '@/types/tmdb/IMediaType';
import { getSession } from '@/utils/authUtils';
import { formatStringDate } from '@/utils/formatters';
import { generateErrorResponse } from '@/utils/handleError';
import logger from '@/utils/logger';
import { userRoutes } from '@/libs/routes';
import ReviewType from '../types/enums/ReviewType';
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
    logger.info('Creating review with : ', request.mediaType, request.mediaId);
    const endpoint = endpoints.user.addReview;
    const body = { ...request, reviewType, mediaType: request.mediaType.toUpperCase() };
    const response = await mdlApiClient.post<CreateEpisodeReview | CreateOverallReview, GenericResponse>(
      endpoint,
      body
    );
    const session = await getSession();
    if (session?.user?.username) {
      revalidatePath(`${userRoutes.profile.replace(':username', session?.user?.username)}/reviews?type=${reviewType}`);
    }
    revalidatePath('/');
    revalidatePath(`/${request.mediaType.toLowerCase()}/${request.mediaId}`);
    revalidatePath(`/${request.mediaType.toLowerCase()}/${request.mediaId}/reviews`);

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
  id: number
): Promise<GenericResponse | ErrorResponse> => {
  try {
    logger.info('Deleting review with : ', id);
    const endpoint = endpoints.user.deleteReview.replace(':id', id.toString());
    const response = await mdlApiClient.del<GenericResponse>(endpoint);
    revalidatePath(`/${mediaType.toLowerCase()}/${mediaId}`);
    revalidatePath(`/${mediaType.toLowerCase()}/${mediaId}/reviews`);
    return response;
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    const status = error?.response?.status ?? 408;
    logger.error(`Error deleting review: ${error?.message}`);
    return error.response.data ?? generateErrorResponse(status, message);
  }
};

const markReviewHelpful = async (
  mediaType: MediaType,
  mediaId: number,
  id: number,
  isHelpful: boolean
): Promise<GenericResponse | ErrorResponse> => {
  try {
    logger.info('Marking review helpful with : ', id);
    const endpoint = endpoints.user.markHelpful.replace(':id', id.toString());
    const params = new URLSearchParams({ isHelpful: Boolean(isHelpful)?.toString() });
    console.log('params', params);
    console.log(endpoint);
    const response = await mdlApiClient.post<null, GenericResponse>(endpoint, null, params);
    revalidatePath(`/${mediaType.toLowerCase()}/${mediaId}`);
    revalidatePath(`/${mediaType.toLowerCase()}/${mediaId}/reviews`);
    return response;
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    const status = error?.response?.status ?? 408;
    logger.error(`Error marking review helpful: ${error?.message}`);
    return error.response.data ?? generateErrorResponse(status, message);
  }
};

const removedHelpfulRating = async (
  mediaType: MediaType,
  mediaId: number,
  id: number
): Promise<GenericResponse | ErrorResponse> => {
  try {
    logger.info('Removing helpful rating with : ', id);
    const endpoint = endpoints.user.markHelpful.replace(':id', id.toString());
    const response = await mdlApiClient.del<GenericResponse>(endpoint);
    revalidatePath(`/${mediaType.toLowerCase()}/${mediaId}`);
    revalidatePath(`/${mediaType.toLowerCase()}/${mediaId}/reviews`);
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
    logger.info('Fetching overall reviews with mediaType: ', mediaType, ' mediaId: ', mediaId);

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
    logger.info('Fetching episode reviews with mediaId: ', mediaId, ' season: ', season, ' episode: ', episode);
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
    logger.info('Fetching review with id: ', id);
    const endpoint = endpoints.public.getReview.replace(':id', id.toString());
    return await mdlApiClient.get<EpisodeReview | OverallReview>(endpoint);
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    const status = error?.response?.status ?? 408;
    logger.error(`Error fetching review: ${error?.message}`);
    return error.response.data ?? generateErrorResponse(status, message);
  }
};

const getReviewHelpful = async (id: number): Promise<ReviewHelpfulData> => {
  try {
    logger.info('Fetching helpful rating with id: ', id);
    const endpoint = endpoints.public.getReviewHelpful.replace(':id', id.toString());
    const session = await getSession();
    const params = new URLSearchParams(session?.user?.userId ? { userId: session.user.userId?.toString() } : {});
    return await mdlApiClient.get<ReviewHelpfulData>(endpoint, params);
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    logger.error(`Error fetching helpful rating: ${message}`);
    return { numberOfHelpfulReviews: 0, numberOfUnhelpfulReviews: 0, isHelpful: null };
  }
};

const getRecentReviews = async (): Promise<OverallReview[] | ErrorResponse> => {
  try {
    logger.info('Fetching recent reviews');
    const endpoint = endpoints.public.getRecentReviews;
    return await mdlApiClient.get<OverallReview[]>(endpoint);
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    const status = error?.response?.status ?? 408;
    logger.error(`Error fetching recent reviews: ${error?.message}`);
    return error.response.data ?? generateErrorResponse(status, message);
  }
};

const getUserReviews = async (username: string, reviewType: ReviewType): Promise<OverallReview[] | ErrorResponse> => {
  try {
    logger.info('Fetching user reviews with username: ', username, ' reviewType: ', reviewType);
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

export {
  authCreateReview as createReview,
  authDeleteReview as deleteReview,
  authMarkReviewHelpful as markReviewHelpful,
  authRemoveHelpfulRating as removedHelpfulRating,
  getMediaOverallReviews,
  getMediaEpisodeReviews,
  getReview,
  getReviewHelpful,
  getRecentReviews,
  getUserReviews
};
