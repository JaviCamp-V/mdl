'use server';

import { revalidateTag, unstable_cache } from 'next/cache';
import AccessLevel from '@/features/auth/types/enums/AccessLevel';
import { getContentDetails } from '@/features/media/service/tmdbService';
import withAuthMiddleware from '@/middleware/withAuthMiddleware';
import mdlApiClient from '@/clients/mdlApiClient';
import ErrorResponse from '@/types/common/ErrorResponse';
import GenericResponse from '@/types/common/GenericResponse';
import LikeData from '@/types/common/LikeData';
import TotalResponse from '@/types/common/TotalResponse';
import MediaType from '@/types/enums/IMediaType';
import { getSession } from '@/utils/authUtils';
import { generateErrorResponse } from '@/utils/handleError';
import logger from '@/utils/logger';
import MakeRecommendation from '../types/interface/MakeRecommendation';
import Recommendation from '../types/interface/Recommendation';
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
    getUserRecs: 'recommendations',
    getUserRecsCount: 'recommendations/{username}/total',
    getMediaRecs: 'recommendations/:mediaType/:mediaId',
    getRec: 'recommendations/:id',
    getRecLikes: 'recommendations/:id/likes'
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
    if (session?.user?.username) {
      revalidateTag(`recommendations-${session?.user?.username}`);
      revalidateTag(`recommendations-count-${session?.user?.username}`);
    }
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
  mediaType: MediaType.movie | MediaType.tv,
  mediaId: number,
  recommendationId: number,
  like: boolean
): Promise<GenericResponse | ErrorResponse> => {
  try {
    logger.info(`${like ? 'Liking' : 'Unliking'} recommendation ${recommendationId}`);
    const endpoint = endpoints.user.likeRec.replace(':id', recommendationId.toString());
    const response = like
      ? await mdlApiClient.post<null, GenericResponse>(endpoint, null)
      : await mdlApiClient.del<GenericResponse>(endpoint);
    revalidateTag(`recommendations-${mediaType?.toLowerCase()}-${mediaId}`);
    revalidateTag(`suggestions-${mediaType?.toLowerCase()}-${mediaId}`);
    revalidateTag(`recommendations-${recommendationId}`);
    revalidateTag(`recommendation-likes-${recommendationId}`);
    return response;
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    const status = error?.response?.status ?? 408;
    logger.error(`Error updating recommendation likes : ${message}`);
    return error.response.data ?? generateErrorResponse(status, message);
  }
};

const getUserRecommendations = async (
  username: string,
  userId?: number | null
): Promise<Recommendation[] | ErrorResponse> => {
  try {
    logger.info(`Getting recommendations for ${username}`);
    const endpoint = endpoints.public.getUserRecs;
    const params = new URLSearchParams({ username });
    if (userId) {
      params.append('userId', userId.toString());
    }
    const response = await mdlApiClient.get<Recommendation[]>(endpoint, params);
    return response;
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    const status = error?.response?.status ?? 408;
    logger.error(`Error getting user recommendations for ${username}: ${message}`);
    return error.response.data ?? generateErrorResponse(status, message);
  }
};

const getUserRecommendationsCount = async (username: string): Promise<TotalResponse> => {
  try {
    logger.info(`Getting recommendations count for ${username}`);
    const endpoint = endpoints.public.getUserRecsCount.replace('{username}', username);
    const response = await mdlApiClient.get<TotalResponse>(endpoint);
    return response;
  } catch (error: any) {
    logger.error(`Error getting user recommendations count for ${username}: ${error?.message}`);
    return { total: 0 };
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

const getRecommendationLikes = async (id: number, userId?: number | null): Promise<LikeData> => {
  try {
    logger.info(`Getting likes for recommendation ${id}`);
    const params = new URLSearchParams();
    if (userId) {
      params.append('userId', userId.toString());
    }
    const endpoint = endpoints.public.getRecLikes.replace(':id', id.toString());
    const response = await mdlApiClient.get<LikeData>(endpoint, params);
    return response;
  } catch (error: any) {
    logger.error(`Error getting likes for recommendation ${id}: ${error?.message}`);
    return { likeCount: 0, hasUserLiked: false };
  }
};

const cacheGetUserRecommendations = async (username: string): Promise<Recommendation[] | ErrorResponse> => {
  try {
    const getCached = unstable_cache(getUserRecommendations, [], {
      tags: [`recommendations-${username}`]
    });
    const session = await getSession();
    const userId = session?.user?.userId;
    return await getCached(username, userId);
  } catch (error: any) {
    logger.error('Error fetching comments: %s', error.message);
    return generateErrorResponse(500, error.message);
  }
};

const cacheGetUserRecommendationsCount = async (username: string): Promise<TotalResponse> => {
  try {
    const getCached = unstable_cache(getUserRecommendationsCount, [], {
      tags: [`recommendations-count-${username}`]
    });
    return await getCached(username);
  } catch (error: any) {
    logger.error('Error fetching comments: %s', error.message);
    return { total: 0 };
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

const cacheGetRecommendationLikes = async (id: number): Promise<LikeData> => {
  try {
    const getCached = unstable_cache(getRecommendationLikes, [], {
      tags: [`recommendation-likes-${id}`]
    });
    const session = await getSession();
    const userId = session?.user?.userId;
    return await getCached(id, userId);
  } catch (error: any) {
    logger.error('Error fetching comments: %s', error.message);
    return { likeCount: 0, hasUserLiked: false };
  }
};

const getMediaSuggestions = async (
  mediaType: MediaType.movie | MediaType.tv,
  mediaId: number
): Promise<Suggestion[]> => {
  try {
    logger.info(`Getting suggestions for ${mediaType} ${mediaId}`);
    const recommendations = await cacheGetMediaRecommendations(mediaType, mediaId);
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
      [] as { mediaType: MediaType.movie | MediaType.tv; mediaId: number; recommendations: Recommendation[] }[]
    );

    const suggestions = await Promise.all(
      groupBySuggestions.map(async (suggestion) => {
        const { mediaType, mediaId, recommendations } = suggestion;
        const lowerCaseMediaType = mediaType.toLowerCase() as MediaType.movie | MediaType.tv;
        const details = await getContentDetails(lowerCaseMediaType, mediaId, true);
        if (!details) {
          return {
            mediaType: lowerCaseMediaType,
            mediaId,
            recommendations: [],
            poster_path: null,
            recordId: null,
            vote_average: 0,
            title: '',
            release_date: '',
            overview: '',
            original_title: '',
            country: '',
            genres: []
          };
        }
        const { poster_path, recordId, vote_average, origin_country, overview, genres } = details;
        const anyDetails = details as any;
        const title = lowerCaseMediaType === MediaType.movie ? anyDetails?.title : anyDetails.name;
        const original_title = anyDetails?.original_title ?? anyDetails?.original_name;
        const release_date = anyDetails?.release_date ?? anyDetails?.first_air_date;
        const sortByLikes = recommendations.sort((a, b) => b.numberOfLikes - a.numberOfLikes);
        return {
          mediaId,
          mediaType: lowerCaseMediaType,
          poster_path,
          recordId,
          vote_average,
          title,
          release_date,
          recommendations: sortByLikes,
          overview,
          original_title,
          country: origin_country?.length ? origin_country[0] : '',
          genres: genres ?? []
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


const authMakeRecommendation = withAuthMiddleware(makeRecommendation, AccessLevel.MEMBER);
const authUpdateReason = withAuthMiddleware(updateReason, AccessLevel.MEMBER);
const authDeleteRecommendation = withAuthMiddleware(deleteRecommendation, AccessLevel.MEMBER);
const authUpdateRecommendationLike = withAuthMiddleware(updateRecommendationLike, AccessLevel.MEMBER);

export {
  authMakeRecommendation as makeRecommendation,
  authUpdateReason as updateReason,
  authDeleteRecommendation as deleteRecommendation,
  authUpdateRecommendationLike as updateRecommendationLike,
  cacheGetUserRecommendations as getUserRecommendations,
  cacheGetUserRecommendationsCount as getUserRecommendationsCount,
  cacheGetMediaRecommendations as getMediaRecommendations,
  cacheGetRecommendation as getRecommendation,
  cacheGetRecommendationLikes as getRecommendationLikes,
  getMediaSuggestions
};