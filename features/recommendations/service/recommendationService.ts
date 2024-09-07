'use server';

import { revalidateTag, unstable_cache } from 'next/cache';
import AccessLevel from '@/features/auth/types/enums/AccessLevel';
import { getContentDetails, getContentSummary } from '@/features/media/service/tmdbService';
import { getUserSummary } from '@/features/profile/service/userProfileService';
import withAuthMiddleware from '@/middleware/withAuthMiddleware';
import mdlApiClient from '@/clients/mdlApiClient';
import ErrorResponse from '@/types/common/ErrorResponse';
import GenericResponse from '@/types/common/GenericResponse';
import HasLikedResponse from '@/types/common/HasLikedResponse';
import LikeData from '@/types/common/LikeData';
import TotalResponse from '@/types/common/TotalResponse';
import MediaType from '@/types/enums/IMediaType';
import { getSession } from '@/utils/authUtils';
import { generateErrorResponse, isErrorResponse } from '@/utils/handleError';
import logger from '@/utils/logger';
import MakeRecommendation from '../types/interface/MakeRecommendation';
import Recommendation, { RecommendationDetails, RecommendationWithLikes } from '../types/interface/Recommendation';
import { Suggestion } from '../types/interface/Suggestion';
import UpdateReason from '../types/interface/UpdateReson';

const endpoints = {
  user: {
    addRec: 'user/recommendations',
    updateReason: 'user/recommendations/:id/reason',
    deleteRec: 'user/recommendations/:id',
    likeRec: 'user/recommendations/:id/like'
  },
  public: {
    getUserRecs: 'recommendations/user/:userId',
    getMediaRecs: 'recommendations/:mediaType/:mediaId',
    getMediaRecsCount: 'recommendations/:mediaType/:mediaId/total',
    getRec: 'recommendations/:id',
    getRecLikes: 'recommendations/:id/likes',
    getUserRecLikeStatus: 'recommendations/:id/likes/user/:userId'
  }
};

const makeRecommendation = async (request: MakeRecommendation): Promise<GenericResponse | ErrorResponse> => {
  try {
    logger.info('Making recommendation for ', request.source.mediaType, request.source.mediaId);
    const endpoint = endpoints.user.addRec;
    const response = await mdlApiClient.post<MakeRecommendation, GenericResponse>(endpoint, request);
    const session = await getSession();
    if (session?.user?.username) {
      revalidateTag(`recommendations-${session?.user?.username}`);
      revalidateTag(`recommendations-count-${session?.user?.username}`);
    }
    revalidateTag(`recommendations-${request.source.mediaType?.toLowerCase()}-${request.source.mediaId}`);
    revalidateTag(`suggestions-${request.source.mediaType?.toLowerCase()}-${request.source.mediaId}`);
    return response;
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    const status = error?.response?.status ?? 408;
    logger.error(`Error making recommendation : ${message}`);
    return error.response.data ?? generateErrorResponse(status, message);
  }
};

const updateReason = async (
  mediaType: MediaType.movie | MediaType.tv,
  mediaId: number,
  recommendationId: number,
  reason: string
): Promise<GenericResponse | ErrorResponse> => {
  try {
    const endpoint = endpoints.user.updateReason.replace(':id', recommendationId.toString());
    const response = await mdlApiClient.patch<UpdateReason, GenericResponse>(endpoint, { reason });
    const session = await getSession();
    if (session?.user?.username) {
      revalidateTag(`recommendations-${session?.user?.username}`);
    }
    revalidateTag(`recommendations-${mediaType?.toLowerCase()}-${mediaId}`);
    revalidateTag(`suggestions-${mediaType?.toLowerCase()}-${mediaId}`);
    revalidateTag(`recommendations-${recommendationId}`);
    return response;
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    const status = error?.response?.status ?? 408;
    logger.error(`Error updating recommendation reason : ${message}`);
    return error.response.data ?? generateErrorResponse(status, message);
  }
};

const deleteRecommendation = async (
  mediaType: MediaType.movie | MediaType.tv,
  mediaId: number,
  recommendationId: number
): Promise<GenericResponse | ErrorResponse> => {
  try {
    const endpoint = endpoints.user.deleteRec.replace(':id', recommendationId.toString());
    const response = await mdlApiClient.del<GenericResponse>(endpoint);
    const session = await getSession();
    if (session?.user?.userId) revalidateTag(`recommendations-${session?.user?.userId}`);
    revalidateTag(`recommendations-likes-${recommendationId}`);
    revalidateTag(`recommendations-${mediaType?.toLowerCase()}-${mediaId}`);
    revalidateTag(`suggestions-${mediaType?.toLowerCase()}-${mediaId}`);
    return response;
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    const status = error?.response?.status ?? 408;
    logger.error(`Error deleting recommendation : ${message}`);
    return error.response.data ?? generateErrorResponse(status, message);
  }
};

const updateRecommendationLike = async (
  recommendationId: number,
  like: boolean
): Promise<GenericResponse | ErrorResponse> => {
  try {
    logger.info(`${like ? 'Liking' : 'Unliking'} recommendation ${recommendationId}`);
    const endpoint = endpoints.user.likeRec.replace(':id', recommendationId.toString());
    const response = like
      ? await mdlApiClient.post<null, GenericResponse>(endpoint, null)
      : await mdlApiClient.del<GenericResponse>(endpoint);

    const session = await getSession();
    if (session?.user?.username)
      revalidateTag(`recommendations-like-status-${recommendationId}-${session?.user?.userId}`);
    revalidateTag(`recommendation-likes-${recommendationId}`);

    return response;
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    const status = error?.response?.status ?? 408;
    logger.error(`Error updating recommendation likes : ${message}`);
    return error.response.data ?? generateErrorResponse(status, message);
  }
};

const getUserRecommendations = async (userId: number): Promise<Recommendation[] | ErrorResponse> => {
  try {
    logger.info(`Getting recommendations for user ${userId}`);
    const endpoint = endpoints.public.getUserRecs.replace(':userId', userId.toString());
    const response = await mdlApiClient.get<Recommendation[]>(endpoint);
    return response;
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    const status = error?.response?.status ?? 408;
    logger.error(`Error getting user recommendations for user ${userId}: ${message}`);
    return error.response.data ?? generateErrorResponse(status, message);
  }
};

const getMediaRecommendations = async (
  mediaType: MediaType.movie | MediaType.tv,
  mediaId: number
): Promise<Recommendation[]> => {
  try {
    logger.info(`Getting recommendations for ${mediaType} ${mediaId}`);
    const endpoint = endpoints.public.getMediaRecs
      .replace(':mediaType', mediaType.toUpperCase())
      .replace(':mediaId', mediaId.toString());
    const response = await mdlApiClient.get<Recommendation[]>(endpoint);
    return response;
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    logger.error(`Error getting media recommendations for ${mediaType} ${mediaId}: ${message}`);
    return [];
  }
};

const getMediaRecommendationsCount = async (
  mediaType: MediaType.movie | MediaType.tv,
  mediaId: number
): Promise<TotalResponse> => {
  try {
    logger.info(`Getting recommendations count for ${mediaType} ${mediaId}`);
    const endpoint = endpoints.public.getMediaRecsCount
      .replace(':mediaType', mediaType.toUpperCase())
      .replace(':mediaId', mediaId.toString());
    const response = await mdlApiClient.get<TotalResponse>(endpoint);
    return response;
  } catch (error: any) {
    logger.error(`Error getting media recommendations count for ${mediaType} ${mediaId}: ${error?.message}`);
    return { total: 0 };
  }
};
const getRecommendation = async (id: number): Promise<Recommendation | ErrorResponse> => {
  try {
    logger.info(`Getting recommendation ${id}`);
    const endpoint = endpoints.public.getRec.replace(':id', id.toString());
    const response = await mdlApiClient.get<Recommendation>(endpoint);
    return response;
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    const status = error?.response?.status ?? 408;
    logger.error(`Error getting recommendation ${id}: ${error?.message}`);
    return error.response.data ?? generateErrorResponse(status, message);
  }
};

const getRecommendationLikes = async (id: number): Promise<TotalResponse> => {
  try {
    logger.info(`Getting likes for recommendation ${id}`);
    const endpoint = endpoints.public.getRecLikes.replace(':id', id.toString());
    const response = await mdlApiClient.get<TotalResponse>(endpoint);
    return response;
  } catch (error: any) {
    logger.error(`Error getting likes for recommendation ${id}: ${error?.message}`);
    return { total: 0 };
  }
};

const getUserRecommendationLikeStatus = async (
  recommendationId: number,
  userId: number
): Promise<HasLikedResponse | null> => {
  try {
    logger.info(`Getting like status for recommendation ${recommendationId} by user ${userId}`);
    const endpoint = endpoints.public.getUserRecLikeStatus
      .replace(':id', recommendationId.toString())
      .replace(':userId', userId.toString());
    const response = await mdlApiClient.get<HasLikedResponse>(endpoint);
    return response;
  } catch (error: any) {
    logger.error(
      `Error getting like status for recommendation ${recommendationId} by user ${userId}: ${error?.message}`
    );
    return null;
  }
};

const cacheGetUserRecommendations = async (userId: number): Promise<Recommendation[] | ErrorResponse> => {
  try {
    const getCached = unstable_cache(getUserRecommendations, [], {
      tags: [`recommendations-${userId}`]
    });
    return await getCached(userId);
  } catch (error: any) {
    logger.error('Error fetching comments: %s', error.message);
    return generateErrorResponse(500, error.message);
  }
};

const cacheGetMediaRecommendations = async (
  mediaType: MediaType.movie | MediaType.tv,
  mediaId: number
): Promise<Recommendation[]> => {
  try {
    const getCached = unstable_cache(getMediaRecommendations, [], {
      tags: [`recommendations-${mediaType?.toLowerCase()}-${mediaId}`]
    });
    return await getCached(mediaType, mediaId);
  } catch (error: any) {
    logger.error('Error fetching comments: %s', error.message);
    return [];
  }
};

const cacheGetMediaRecommendationsCount = async (
  mediaType: MediaType.movie | MediaType.tv,
  mediaId: number
): Promise<TotalResponse> => {
  try {
    const getCached = unstable_cache(getMediaRecommendationsCount, [], {
      tags: [`recommendations-count-${mediaType?.toLowerCase()}-${mediaId}`]
    });
    return await getCached(mediaType, mediaId);
  } catch (error: any) {
    logger.error('Error fetching comments: %s', error.message);
    return { total: 0 };
  }
};

const cacheGetRecommendation = async (id: number): Promise<Recommendation | ErrorResponse> => {
  try {
    const getCached = unstable_cache(getRecommendation, [], {
      tags: [`recommendation-${id}`]
    });
    return await getCached(id);
  } catch (error: any) {
    logger.error('Error fetching comments: %s', error.message);
    return generateErrorResponse(500, error.message);
  }
};

const cacheGetRecommendationLikes = async (id: number): Promise<TotalResponse> => {
  try {
    const getCached = unstable_cache(getRecommendationLikes, [], {
      tags: [`recommendation-likes-${id}`]
    });
    return await getCached(id);
  } catch (error: any) {
    logger.error('Error fetching comments: %s', error.message);
    return { total: 0 };
  }
};

const cacheGetUserRecommendationLikeStatus = async (recommendationId: number): Promise<HasLikedResponse | null> => {
  try {
    const session = await getSession();
    const userId = session?.user?.userId;
    if (!userId) return null;
    const getCached = unstable_cache(getUserRecommendationLikeStatus, [], {
      tags: [`recommendations-like-status-${recommendationId}-${userId}`]
    });
    return await getCached(recommendationId, userId);
  } catch (error: any) {
    logger.error('Error fetching comments: %s', error.message);
    return null;
  }
};

const mapRecommendationWithLikes = async (recommendation: Recommendation): Promise<RecommendationWithLikes> => {
  const totalResponse = await cacheGetRecommendationLikes(recommendation.id);
  const user = await getUserSummary(recommendation.userId);
  const hasLikeResponse = await cacheGetUserRecommendationLikeStatus(recommendation.id);
  return {
    ...recommendation,
    user: user!,
    numberOfLikes: totalResponse.total,
    hasUserLiked: hasLikeResponse?.hasUserLiked ?? false
  };
};
const getRecommendationWithLikeData = async (
  mediaType: MediaType.movie | MediaType.tv,
  mediaId: number
): Promise<RecommendationWithLikes[]> => {
  const recommendations = await cacheGetMediaRecommendations(mediaType, mediaId);
  return await Promise.all(recommendations.map(mapRecommendationWithLikes));
};

const blankDetails = (mediaType: MediaType.movie | MediaType.tv, mediaId: number) => ({
  mediaType,
  mediaId,
  poster_path: null,
  recordId: null,
  vote_average: 0,
  title: '',
  release_date: '',
  overview: '',
  original_title: '',
  origin_country: [],
  genres: []
});
const getMediaSuggestions = async (
  mediaType: MediaType.movie | MediaType.tv,
  mediaId: number
): Promise<Suggestion[]> => {
  try {
    logger.info(`Getting suggestions for ${mediaType} ${mediaId}`);
    const recommendations = await getRecommendationWithLikeData(mediaType, mediaId);
    const groupBySuggestions = recommendations.reduce(
      (acc, rec) => {
        const index = acc.findIndex(
          (s) => s.mediaType === rec.suggested.mediaType && s.mediaId === rec.suggested.mediaId
        );
        if (index !== -1) {
          acc[index].recommendations.push(rec);
          return acc;
        }

        const suggestion = {
          mediaType: rec.suggested.mediaType,
          mediaId: rec.suggested.mediaId,
          recommendations: [rec]
        };
        acc.push(suggestion);
        return acc;
      },
      [] as { mediaType: MediaType.movie | MediaType.tv; mediaId: number; recommendations: RecommendationWithLikes[] }[]
    );

    const suggestions = await Promise.all(
      groupBySuggestions.map(async (suggestion) => {
        const { mediaType, mediaId, recommendations } = suggestion;
        const lowerCaseMediaType = mediaType.toLowerCase() as MediaType.movie | MediaType.tv;
        const details = await getContentSummary(lowerCaseMediaType, mediaId, true);
        if (!details) return { ...blankDetails(lowerCaseMediaType, mediaId), recommendations: recommendations };
        const sortByLikes = recommendations.sort((a, b) => b.numberOfLikes - a.numberOfLikes);
        return {
          ...details,
          recommendations: sortByLikes
        };
      })
    );

    return suggestions;
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    logger.error(`Error getting media suggestions for ${mediaType} ${mediaId}: ${message}`);
    return [];
  }
};

const getUsersSuggestions = async (userId: number): Promise<RecommendationDetails[]> => {
  const recommendations = await cacheGetUserRecommendations(userId);
  if (isErrorResponse(recommendations)) return [];

  const suggestions = await Promise.all(
    recommendations.map(async (rec) => {
      const source = await getContentSummary(rec.source.mediaType, rec.source.mediaId, true);
      const suggested = await getContentSummary(rec.suggested.mediaType, rec.suggested.mediaId, true);
      const recommendationWithLikes = await mapRecommendationWithLikes(rec);
      return {
        ...recommendationWithLikes,
        source: source ?? blankDetails(rec.source.mediaType, rec.source.mediaId),
        suggested: suggested ?? blankDetails(rec.suggested.mediaType, rec.suggested.mediaId)
      };
    })
  );

  return suggestions;
};
const authMakeRecommendation = withAuthMiddleware(makeRecommendation, AccessLevel.MEMBER);
const authUpdateReason = withAuthMiddleware(updateReason, AccessLevel.MEMBER);
const authDeleteRecommendation = withAuthMiddleware(deleteRecommendation, AccessLevel.MEMBER);
const authUpdateRecommendationLike = withAuthMiddleware(updateRecommendationLike, AccessLevel.MEMBER);

export {
  authMakeRecommendation as makeRecommendation,
  authUpdateReason as updateReason,
  authDeleteRecommendation as deleteRecommendation,
  authUpdateRecommendationLike as updateRecommendationLike,
  cacheGetMediaRecommendations as getMediaRecommendations,
  cacheGetMediaRecommendationsCount as getMediaRecommendationsCount,
  cacheGetRecommendation as getRecommendation,
  cacheGetRecommendationLikes as getRecommendationLikes,
  getMediaSuggestions,
  getUsersSuggestions
};