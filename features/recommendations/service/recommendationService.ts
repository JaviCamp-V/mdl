'use server';

import { revalidatePath } from 'next/cache';
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
import routes from '@/libs/routes';
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
      revalidatePath(`${routes.user.profile.replace(':username', session?.user?.username)}/recommendations`);
    }
    revalidatePath('/');
    revalidatePath(`/${request.source.mediaType.toLowerCase()}/${request.source.mediaId}`);
    revalidatePath(`/${request.source.mediaType.toLowerCase()}/${request.source.mediaId}/recommendations`);
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
      revalidatePath(`${routes.user.profile.replace(':username', session?.user?.username)}/recommendations`);
    }
    revalidatePath(`/${mediaType}/${mediaId}/recommendations`);
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
      revalidatePath(`${routes.user.profile.replace(':username', session?.user?.username)}/recommendations`);
    }
    revalidatePath(`/${mediaType}/${mediaId}`);
    revalidatePath(`/${mediaType}/${mediaId}/recommendations`);
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
    const session = await getSession();
    if (session?.user?.username) {
      revalidatePath(`${routes.user.profile.replace(':username', session?.user?.username)}/recommendations`);
    }
    revalidatePath(`/${mediaType}/${mediaId}/recommendations`);
    return response;
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    const status = error?.response?.status ?? 408;
    logger.error(`Error updating recommendation likes : ${message}`);
    return error.response.data ?? generateErrorResponse(status, message);
  }
};

const getUserRecommendations = async (username: string): Promise<Recommendation[] | ErrorResponse> => {
  try {
    logger.info(`Getting recommendations for ${username}`);
    const endpoint = endpoints.public.getUserRecs;
    const params = new URLSearchParams({ username });
    const session = await getSession();
    if (session?.user?.userId) {
      params.append('userId', session.user.userId.toString());
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

const getRecommendationLikes = async (id: number): Promise<LikeData> => {
  try {
    logger.info(`Getting likes for recommendation ${id}`);
    const session = await getSession();
    const params = new URLSearchParams();
    if (session?.user?.userId) {
      params.append('userId', session.user.userId.toString());
    }
    const endpoint = endpoints.public.getRecLikes.replace(':id', id.toString());
    const response = await mdlApiClient.get<LikeData>(endpoint, params);
    return response;
  } catch (error: any) {
    logger.error(`Error getting likes for recommendation ${id}: ${error?.message}`);
    return { likeCount: 0, hasUserLiked: false };
  }
};

const getMediaSuggestions = async (
  mediaType: MediaType.movie | MediaType.tv,
  mediaId: number
): Promise<Suggestion[]> => {
  try {
    logger.info(`Getting suggestions for ${mediaType} ${mediaId}`);
    const recommendations = await getMediaRecommendations(mediaType, mediaId);
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
  getUserRecommendations,
  getUserRecommendationsCount,
  getMediaRecommendations,
  getRecommendation,
  getRecommendationLikes,
  getMediaSuggestions
};
