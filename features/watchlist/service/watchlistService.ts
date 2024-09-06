'use server';

import { revalidateTag, unstable_cache } from 'next/cache';
import AccessLevel from '@/features/auth/types/enums/AccessLevel';
import { getContentDetails } from '@/features/media/service/tmdbService';
import MovieDetails from '@/features/media/types/interfaces/MovieDetails';
import TVDetails from '@/features/media/types/interfaces/TVDetails';
import { getTitle, getYear } from '@/features/media/utils/tmdbUtils';
import withAuthMiddleware from '@/middleware/withAuthMiddleware';
import mdlApiClient from '@/clients/mdlApiClient';
import ErrorResponse from '@/types/common/ErrorResponse';
import GenericResponse from '@/types/common/GenericResponse';
import MediaType from '@/types/enums/IMediaType';
import { getSession } from '@/utils/authUtils';
import { generateErrorResponse } from '@/utils/handleError';
import logger from '@/utils/logger';
import GeneralWatchlistRecord from '../types/interfaces/GeneralWatchlistRecord';
import UpdateWatchlistRequest from '../types/interfaces/UpdateWatchlistRequest';
import WatchlistItems from '../types/interfaces/WatchlistItem';
import WatchlistRecord from '../types/interfaces/WatchlistRecord';


const endpoints = {
  watchlistByUsername: 'watchlist/{username}',
  userWatchlist: 'user/watchlist',
  userWatchlistRecordById: 'user/watchlist/:id',
  userWatchlistRecordByMedia: 'user/watchlist/{mediaType}/{mediaId}'
};

/**
 * Update & Create watchlist record
 * @param request<UpdateWatchlistRequest>
 * @returns response<GenericResponse | ErrorResponse>
 * @throws ErrorResponse
 * @description Update or create a watchlist record and revalidate watchlist cache data
 */

const updateWatchlistRecord = async (request: UpdateWatchlistRequest): Promise<GenericResponse | ErrorResponse> => {
  try {
    logger.info('Updating watchlist record with : ', request.mediaType, request.mediaId);
    const response = await mdlApiClient.post<UpdateWatchlistRequest, GenericResponse>(endpoints.userWatchlist, request);
    const session = await getSession();
    if (session?.user?.username) {
      revalidateTag(`watchlist-${session.user.username}`);
    }
    return response;
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    const status = error?.response?.status ?? 408;
    logger.error(`Error updating watchlist record: ${error?.message}`);
    return error.response.data ?? generateErrorResponse(status, message);
  }
};

/**
 * Get logged in user watchlist
 * @returns response<GeneralWatchlistRecord[]>
 * @description Fetch watchlist data, if error return empty array
 */
const getLegacyWatchlist = async (): Promise<GeneralWatchlistRecord[]> => {
  try {
    logger.info('Fetching watchlist');
    return await mdlApiClient.get<GeneralWatchlistRecord[]>(endpoints.userWatchlist);
  } catch (error: any) {
    logger.error(`Error fetching watchlist: ${error?.message}, ${error?.response?.data?.message}`);
    return [];
  }
};

/**
 * Get watchlist record by id for logged in user
 * @param id<number>
 * @returns response<WatchlistRecord | null | ErrorResponse>
 * @throws ErrorResponse
 * @description Fetch watchlist record by id
 */
const getWatchlistRecord = async (id: number): Promise<WatchlistRecord | null | ErrorResponse> => {
  try {
    logger.info('Fetching watchlist record with id: ', id);
    const endpoint = endpoints.userWatchlistRecordById.replace(':id', id.toString());
    return await mdlApiClient.get<WatchlistRecord>(endpoint);
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    const status = error?.response?.status ?? 408;
    logger.error(`Error fetching watchlist record: ${error?.message}`);
    return error.response.data ?? generateErrorResponse(status, message);
  }
};

/**
 * Get watchlist record by mediaType and mediaId for logged in user
 * @param mediaType<MediaType.tv or MediaType.movie>
 * @param mediaId<number>
 * @returns response<WatchlistRecord | null | ErrorResponse>
 * @throws ErrorResponse
 * @description Fetch watchlist record by mediaType and mediaId
 */
const getWatchlistRecordByMedia = async (
  mediaType: MediaType.tv | MediaType.movie,
  mediaId: number
): Promise<WatchlistRecord | null | ErrorResponse> => {
  try {
    logger.info('Fetching watchlist record with mediaType: ', mediaType, ' mediaId: ', mediaId);
    const endpoint = endpoints.userWatchlistRecordByMedia
      .replace('{mediaType}', mediaType)
      .replace('{mediaId}', mediaId.toString().toUpperCase());
    return await mdlApiClient.get<WatchlistRecord>(endpoint);
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    const status = error?.response?.status ?? 408;
    logger.error(`Error fetching watchlist record: ${error?.message}`);
    return error.response.data ?? generateErrorResponse(status, message);
  }
};
/**
 * Delete watchlist record by id for logged in user
 * @param id<number>
 * @returns response<GenericResponse | ErrorResponse>
 * @throws ErrorResponse
 * @description Delete watchlist record by id and revalidate watchlist cache data
 * */
const deleteWatchlistRecord = async (id: number): Promise<GenericResponse | ErrorResponse> => {
  try {
    logger.info('Deleting watchlist record with id: ', id);
    const endpoint = endpoints.userWatchlistRecordById.replace(':id', id.toString());
    const response = await mdlApiClient.del<GenericResponse>(endpoint);
    const session = await getSession();
    if (session?.user?.username) {
      revalidateTag(`watchlist-${session.user.username}`);
    }
    return response;
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    const status = error?.response?.status ?? 408;
    logger.error(`Error deleting watchlist record: ${error?.message}`);
    return error.response.data ?? generateErrorResponse(status, message);
  }
};

/**
 * Helper function to add details to watchlist item
 * @param watchlist<GeneralWatchlistRecord>
 * @returns response<WatchlistItems>
 * @description Fetch details for watchlist item and return WatchlistItems
 *  makes a call to tmdb Actions to fetch movie or tv details for watchlist item
 * if error return default values
 * if success return WatchlistItems with posterPath, genres, overview, voteAverage, title,
 * originalTitle,  country, year, isAiring, totalEpisodes, runtime, episodeWatched
 */
const addAddDetailsToWatchlist = async (watchlist: GeneralWatchlistRecord): Promise<WatchlistItems> => {
  try {
    const type = watchlist.mediaType.toLowerCase() as any;
    logger.info(`Fetching details for watchlist item with mediaType: ${type}, mediaId: ${watchlist.mediaId}`);

    const details = await getContentDetails(type, watchlist.mediaId, false);
    if (!details) throw new Error('Details not found');

    const { poster_path, genres, overview, vote_average = 0, vote_count = 0 } = details;

    const title = getTitle({ ...details, media_type: type } as any);
    const originalTitle =
      type === MediaType.tv ? (details as TVDetails).original_name : (details as MovieDetails).original_title;
    const country = details.origin_country.length ? details.origin_country[0] : 'Unknown';
    const year = getYear(details as any);
    const isAiring = type === MediaType.tv ? details.status === 'Returning Series' : false;
    const totalEpisodes = type === MediaType.tv ? (details as TVDetails).number_of_episodes : 1;
    const runtime =
      type === MediaType.tv ? (details as TVDetails).episode_run_time[0] : ((details as MovieDetails).runtime ?? 0);
    const episodeWatched = type === MediaType.tv ? watchlist.episodeWatched : 1;

    return {
      ...watchlist,
      title,
      originalTitle,
      country,
      year,
      isAiring,
      totalEpisodes,
      runtime,
      episodeWatched,
      posterPath: poster_path,
      genres,
      overview,
      voteAverage: vote_average
    };
  } catch (error: any) {
    logger.error(`Error fetching details for watchlist item: ${error?.message}, ${error?.response?.data?.message}`);
    return {
      ...watchlist,
      title: '',
      originalTitle: '',
      country: '',
      year: 'TBA',
      isAiring: false,
      totalEpisodes: 1,
      runtime: 0,
      posterPath: null,
      genres: [],
      overview: '',
      voteAverage: 0,
      episodeWatched: 1
    };
  }
};

/**
 * Get watchlist for user by username
 * @param username<string>
 * @returns response<WatchlistItems[]>
 * @description Fetch watchlist for user by username
 * if error return empty array
 * public access
 */

const getWatchListByUsername = async (username: string): Promise<GeneralWatchlistRecord[]> => {
  try {
    logger.info(`Fetching watchlist for user with  ${username}`);
    const endpoint = endpoints.watchlistByUsername.replace('{username}', username);
    return await mdlApiClient.get<GeneralWatchlistRecord[]>(endpoint);
  } catch (error: any) {
    logger.error(`Error fetching watchlist for user: ${error?.message}, ${error?.response?.data?.message}`);
    return [];
  }
};

const cacheGetWatchlistByUsername = async (username: string): Promise<GeneralWatchlistRecord[]> => {
  try {
    const getCached = unstable_cache(getWatchListByUsername, [], {
      tags: [`watchlist-${username}`]
    });
    return await getCached(username);
  } catch (error: any) {
    logger.error('Error fetching watchlist for user: ', error?.message);
    return [];
  }
};
const getUserWatchlist = async (username: string): Promise<WatchlistItems[]> => {
  try {
    const watchlist = await cacheGetWatchlistByUsername(username);
    const watchlistWithDetails = await Promise.all(watchlist.map(addAddDetailsToWatchlist));
    return watchlistWithDetails;
  } catch (error: any) {
    logger.error(`Error fetching watchlist for user: ${error?.message}, ${error?.response?.data?.message}`);
    return [];
  }
};

const authUpdateWatchlistRecord = withAuthMiddleware(updateWatchlistRecord, AccessLevel.MEMBER);
const authDeleteWatchlistRecord = withAuthMiddleware(deleteWatchlistRecord, AccessLevel.MEMBER);
const authGetWatchlistRecord = withAuthMiddleware(getWatchlistRecord, AccessLevel.MEMBER, null);
const authGetWatchlistRecordByMedia = withAuthMiddleware(getWatchlistRecordByMedia, AccessLevel.MEMBER, null);

const getWatchlist = async (): Promise<GeneralWatchlistRecord[]> => {
  try {
    const session = await getSession();
    if (!session?.user?.username) return [];
    return await cacheGetWatchlistByUsername(session.user.username);
  } catch (error: any) {
    logger.error('Error fetching watchlist: ', error?.message);
    return [];
  }
};

const cacheGetWatchlistRecord = async (id: number): Promise<WatchlistRecord | null | ErrorResponse> => {
  try {
    const session = await getSession();
    if (!session?.user?.username) return generateErrorResponse(401, 'Unauthorized');
    const record = await getWatchlistRecord(id);
    const loader = async (id: number) => {
      logger.info('Fetching watchlist record with id form cache: ', id);
      return record;
    };
    const getCached = unstable_cache(loader, [session.user.username], {
      tags: [`watchlist-${session?.user?.username}`]
    });
    return await getCached(id);
  } catch (error: any) {
    logger.error('Error fetching watchlist record: ', error?.message);
    return null;
  }
};

const getUserWatchRecord = async (
  username: string,
  mediaType: MediaType,
  mediaId: number
): Promise<GeneralWatchlistRecord | undefined> => {
  const watchlist = await cacheGetWatchlistByUsername(username);
  return watchlist.find((item) => item.mediaType.toLowerCase() === mediaType && item.mediaId === mediaId);
};
export {
  authUpdateWatchlistRecord as updateWatchlistRecord,
  getWatchlist,
  cacheGetWatchlistRecord as getWatchlistRecord,
  authGetWatchlistRecordByMedia as getWatchlistRecordByMedia,
  authDeleteWatchlistRecord as deleteWatchlistRecord,
  getUserWatchlist,
  getUserWatchRecord
};