'use server';

import { revalidateTag } from 'next/cache';
import AccessLevel from '@/features/auth/types/enums/AccessLevel';
import withAuthMiddleware from '@/middleware/withAuthMiddleware';
import mdlApiClient from '@/clients/mdlApiClient';
import ErrorResponse from '@/types/common/ErrorResponse';
import GenericResponse from '@/types/common/GenericResponse';
import handleServerError from '@/utils/handleServerError';
import logger from '@/utils/logger';
import ReviewType from '../types/enums/ReviewType';
import { HelpfulRatingMetaData } from '../types/interfaces/ReviewHelpfulData';
import { CreateEpisodeReview, CreateOverallReview } from '../types/interfaces/ReviewRequest';
import { ReviewMetaData } from '../types/interfaces/ReviewResponse';
import { reviewUpdateEndpoints as endpoints } from './endpoints';


type ReviewResponse = GenericResponse<ReviewMetaData>;
type HelpfulRatingResponse = GenericResponse<HelpfulRatingMetaData>;

const createReview = async <T extends ReviewType>(
  reviewType: T,
  request: T extends ReviewType.EPISODE ? CreateEpisodeReview : CreateOverallReview
): Promise<ReviewResponse | ErrorResponse> => {
  const { endpoint, tags } = endpoints.addReview;
  try {
    logger.info('Creating review with: %s %s', request.mediaType, request.mediaId);
    const body = { ...request, reviewType, mediaType: request.mediaType.toUpperCase() };
    const response = await mdlApiClient.post<CreateEpisodeReview | CreateOverallReview, ReviewResponse>(endpoint, body);
    const { id, mediaType, mediaId, season, episode, userId } = response.data;
    tags.forEach((tag) => {
      const tagWithValues = tag
        .replace('{id}', id?.toString())
        .replace('{userId}', userId!.toString())
        .replace('{mediaType}', mediaType?.toString().toLowerCase())
        .replace('{mediaId}', mediaId?.toString())
        .replace('{reviewType}', response.data.reviewType)
        .replace('{season}', season?.toString())
        .replace('{episode}', episode?.toString());
      logger.info('Revalidating tag: %s', tagWithValues);
      revalidateTag(tagWithValues);
    });
    return response;
  } catch (error: any) {
    return handleServerError(error, 'creating review');
  }
};

const deleteReview = async (id: number): Promise<ReviewResponse | ErrorResponse> => {
  try {
    logger.info('Deleting review with: %s', id);
    const { endpoint, tags } = endpoints.deleteReview;
    const endpointWithId = endpoint.replace(':id', id.toString());
    const response = await mdlApiClient.del<ReviewResponse>(endpointWithId);
    const { mediaType, mediaId, reviewType, season, episode, userId } = response.data;
    tags.forEach((tag) => {
      const tagWithValues = tag
        .replace('{id}', id?.toString())
        .replace('{userId}', userId!.toString())
        .replace('{mediaType}', mediaType?.toString().toLowerCase())
        .replace('{mediaId}', mediaId?.toString())
        .replace('{reviewType}', reviewType)
        .replace('{season}', season?.toString())
        .replace('{episode}', episode?.toString());
      revalidateTag(tagWithValues);
    });
    return response;
  } catch (error: any) {
    return handleServerError(error, 'deleting review');
  }
};

const markReviewHelpful = async (id: number, isHelpful: boolean): Promise<HelpfulRatingResponse | ErrorResponse> => {
  const { endpoint, tags } = endpoints.markReviewHelpful;
  try {
    logger.info('Marking review helpful with: %s', id);
    const endpointWithId = endpoint.replace(':id', id.toString());
    const params = new URLSearchParams({ isHelpful: Boolean(isHelpful)?.toString() });
    const response = await mdlApiClient.post<null, HelpfulRatingResponse>(endpointWithId, null, params);
    const { reviewId, userId } = response.data;
    tags.forEach((tag) =>
      revalidateTag(tag.replace('{id}', reviewId?.toString()).replace('{userId}', userId?.toString()))
    );
    return response;
  } catch (error: any) {
    return handleServerError(error, 'marking review helpful');
  }
};

const removedHelpfulRating = async (id: number): Promise<HelpfulRatingResponse | ErrorResponse> => {
  const { endpoint, tags } = endpoints.removeHelpfulRating;
  try {
    logger.info('Removing helpful rating with: %s', id);
    const endpointWithId = endpoint.replace(':id', id.toString());
    const response = await mdlApiClient.del<HelpfulRatingResponse>(endpointWithId);
    const { userId, reviewId } = response.data;
    tags.forEach((tag) =>
      revalidateTag(tag.replace('{id}', reviewId?.toString()).replace('{userId}', userId?.toString()))
    );
    return response;
  } catch (error: any) {
    return handleServerError(error, 'removing helpful rating');
  }
};

const authCreateReview = withAuthMiddleware(createReview, AccessLevel.MEMBER);
const authDeleteReview = withAuthMiddleware(deleteReview, AccessLevel.MEMBER);
const authMarkReviewHelpful = withAuthMiddleware(markReviewHelpful, AccessLevel.MEMBER);
const authRemoveHelpfulRating = withAuthMiddleware(removedHelpfulRating, AccessLevel.MEMBER);

export {
  authCreateReview as createReview,
  authDeleteReview as deleteReview,
  authMarkReviewHelpful as markReviewHelpful,
  authRemoveHelpfulRating as removeHelpfulRating
};