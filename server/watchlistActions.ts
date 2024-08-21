'use server';

import { revalidatePath } from 'next/cache';
import withAuthMiddleware from '@/middleware/withAuthMiddleware';
import mdlApiClient from '@/clients/mdlApiClient';
import AccessLevel from '@/types/Auth/AccessLevel';
import ErrorResponse from '@/types/common/ErrorResponse';
import GenericResponse from '@/types/common/GenericResponse';
import MediaType from '@/types/tmdb/IMediaType';
import MovieDetails from '@/types/tmdb/IMovieDetails';
import TVDetails from '@/types/tmdb/ITVDetails';
import GeneralWatchlistRecord, { WatchlistItems } from '@/types/watchlist/IGeneralWatchlistRecord';
import UpdateWatchlistRequest from '@/types/watchlist/IUpdateWatchlistRequest';
import WatchlistRecord from '@/types/watchlist/IWatchlistRecord';
import { generateErrorResponse } from '@/utils/handleError';
import logger from '@/utils/logger';
import { getTitle, getYear } from '@/utils/tmdbUtils';
import { getMovieDetails, getTVDetails } from './tmdbActions';

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
    revalidatePath('/', 'layout');
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
const getWatchlist = async (): Promise<GeneralWatchlistRecord[]> => {
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
    revalidatePath('/', 'layout');
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
    const type = watchlist.mediaType.toLowerCase();
    logger.info(
      `Fetching details for watchlist item with mediaType: ${watchlist.mediaType}, mediaId: ${watchlist.mediaId}`
    );

    const details =
      type === MediaType.tv
        ? await getTVDetails(watchlist.mediaId, false)
        : await getMovieDetails(watchlist.mediaId, false);

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
const getUserWatchlist = async (username: string): Promise<WatchlistItems[]> => {
  try {
    logger.info(`Fetching watchlist for user with  ${username}`);
    const endpoint = endpoints.watchlistByUsername.replace('{username}', username);
    const watchlist = await mdlApiClient.get<GeneralWatchlistRecord[]>(endpoint);
    const watchlistWithDetails = await Promise.all(watchlist.map(addAddDetailsToWatchlist));
    return watchlistWithDetails;
  } catch (error: any) {
    logger.error(`Error fetching watchlist for user: ${error?.message}, ${error?.response?.data?.message}`);
    return [];
  }
};

const authGetWatchlist = withAuthMiddleware(getWatchlist, AccessLevel.MEMBER, []);
const authUpdateWatchlistRecord = withAuthMiddleware(updateWatchlistRecord, AccessLevel.MEMBER);
const authDeleteWatchlistRecord = withAuthMiddleware(deleteWatchlistRecord, AccessLevel.MEMBER);
const authGetWatchlistRecord = withAuthMiddleware(getWatchlistRecord, AccessLevel.MEMBER, null);
const authGetWatchlistRecordByMedia = withAuthMiddleware(getWatchlistRecordByMedia, AccessLevel.MEMBER, null);

export {
  authUpdateWatchlistRecord as updateWatchlistRecord,
  authGetWatchlist as getWatchlist,
  authGetWatchlistRecord as getWatchlistRecord,
  authGetWatchlistRecordByMedia as getWatchlistRecordByMedia,
  authDeleteWatchlistRecord as deleteWatchlistRecord,
  getUserWatchlist
};
