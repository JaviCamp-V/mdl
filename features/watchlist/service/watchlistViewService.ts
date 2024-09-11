'use server';

import { unstable_cache } from 'next/cache';
import mdlApiClient from '@/clients/mdlApiClient';
import TotalResponse from '@/types/common/TotalResponse';
import MediaType from '@/types/enums/IMediaType';
import { getSession } from '@/utils/authUtils';
import handleServerError from '@/utils/handleServerError';
import logger from '@/utils/logger';
import { revalidate } from '@/libs/common';
import GeneralWatchlistRecord from '../types/interfaces/GeneralWatchlistRecord';
import WatchStatusCount from '../types/interfaces/WatchStatusCount';
import WatchlistRecord from '../types/interfaces/WatchlistRecord';
import { viewEndpoints as endpoints } from './endpoints';

/**
 * Get user watchlist
 * @param userId<number>
 * @returns response<GeneralWatchlistRecord[]>
 */

const getUserWatchlistByUserId = async (userId: number): Promise<GeneralWatchlistRecord[]> => {
  try {
    const endpoint = endpoints.watchlistByUserId.endpoint.replace('{userId}', userId.toString());
    const response = await mdlApiClient.get<GeneralWatchlistRecord[]>(endpoint);
    return response;
  } catch (error: any) {
    handleServerError(error, 'getting user watchlist');
    return [];
  }
};

/**
 * Get user watchlist by username
 * @param username<string>
 * @returns response<GeneralWatchlistRecord[]>
 */

const getUserWatchlistByUsername = async (username: string): Promise<GeneralWatchlistRecord[]> => {
  try {
    const endpoint = endpoints.watchlistByUsername.endpoint.replace('{username}', username);
    const response = await mdlApiClient.get<GeneralWatchlistRecord[]>(endpoint);
    return response;
  } catch (error: any) {
    handleServerError(error, 'getting user watchlist');
    return [];
  }
};

/**
 * Get user watchlist record
 * @param mediaType<MediaType>
 * @param mediaId<number>
 * @param userId<number>
 * @returns response<GeneralWatchlistRecord | null>
 * */

const getUserWatchlistRecord = async (
  mediaType: MediaType,
  mediaId: number,
  userId: number
): Promise<GeneralWatchlistRecord | null> => {
  try {
    const endpoint = endpoints.watchlistRecord.endpoint
      .replace('{mediaType}', mediaType?.toUpperCase())
      .replace('{mediaId}', mediaId.toString())
      .replace('{userId}', userId.toString());
    const response = await mdlApiClient.get<GeneralWatchlistRecord>(endpoint);
    return response;
  } catch (error: any) {
    handleServerError(error, 'getting user watchlist record');
    return null;
  }
};

/**
 * Get watchlist record total by media
 * @param mediaType<MediaType>
 * @param mediaId<number>
 * @returns response<TotalResponse>
 */

const getWatchlistRecordTotalByMedia = async (mediaType: MediaType, mediaId: number): Promise<TotalResponse> => {
  try {
    const endpoint = endpoints.watchlistRecordTotalByMedia.endpoint
      .replace('{mediaType}', mediaType.toUpperCase())
      .replace('{mediaId}', mediaId.toString());
    const response = await mdlApiClient.get<TotalResponse>(endpoint);
    return response;
  } catch (error: any) {
    handleServerError(error, 'getting watchlist record total');
    return { total: 0 };
  }
};

/**
 * Get watchlist statuses total by media
 * @param mediaType<MediaType>
 * @param mediaId<number>
 * @returns response<WatchStatusCount[]>
 */

const getWatchlistStatuesTotalByMedia = async (mediaType: MediaType, mediaId: number): Promise<WatchStatusCount[]> => {
  try {
    const endpoint = endpoints.watchlistStatuesTotalByMedia.endpoint
      .replace('{mediaType}', mediaType?.toUpperCase())
      .replace('{mediaId}', mediaId.toString());
    const response = await mdlApiClient.get<WatchStatusCount[]>(endpoint);
    return response;
  } catch (error: any) {
    handleServerError(error, 'getting watchlist statuses total');
    return [];
  }
};

/**
 * protected get user complete watchlist record  with history by id
 * @param id<number>
 * @returns response<WatchlistRecord | null>
 */

const getUserWatchlistRecordById = async (id: number): Promise<WatchlistRecord | null> => {
  try {
    const endpoint = endpoints.userWatchlistRecordById.endpoint.replace('{id}', id.toString());
    const response = await mdlApiClient.get<WatchlistRecord>(endpoint);
    return response;
  } catch (error: any) {
    handleServerError(error, 'getting user watchlist record');
    return null;
  }
};

/**
 * protected get user watchlist record by media
 * @param mediaType<MediaType>
 * @param mediaId<number>
 * @returns response<WatchlistRecord | null>
 */

const getUserWatchlistByMedia = async (mediaType: MediaType, mediaId: number): Promise<WatchlistRecord | null> => {
  try {
    const endpoint = endpoints.userWatchlistByMedia.endpoint
      .replace('{mediaType}', mediaType?.toUpperCase())
      .replace('{mediaId}', mediaId.toString());
    const response = await mdlApiClient.get<WatchlistRecord>(endpoint);
    return response;
  } catch (error: any) {
    handleServerError(error, 'getting user watchlist record');
    return null;
  }
};

// Cache functions
const cacheUserWatchlistByUserId = async (userId: number): Promise<GeneralWatchlistRecord[]> => {
  try {
    const tags = endpoints.watchlistByUserId.tags.map((tag) => tag.replace('{userId}', userId.toString()));
    const getCached = unstable_cache(getUserWatchlistByUserId, [], { tags, revalidate });
    return await getCached(userId);
  } catch (error: any) {
    handleServerError(error, 'getting user watchlist from cache');
    return [];
  }
};

const cacheUserWatchlistByUsername = async (username: string): Promise<GeneralWatchlistRecord[]> => {
  try {
    const tags = endpoints.watchlistByUsername.tags.map((tag) => tag.replace('{username}', username));
    const getCached = unstable_cache(getUserWatchlistByUsername, [], { tags, revalidate });
    return await getCached(username);
  } catch (error: any) {
    handleServerError(error, 'getting user watchlist from cache');
    return [];
  }
};

const cacheUserWatchlistRecord = async (
  mediaType: MediaType,
  mediaId: number,
  userId: number
): Promise<GeneralWatchlistRecord | null> => {
  try {
    const tags = endpoints.watchlistRecord.tags.map((tag) =>
      tag
        .replace('{mediaType}', mediaType.toLowerCase())
        .replace('{mediaId}', mediaId.toString())
        .replace('{userId}', userId.toString())
    );
    const getCached = unstable_cache(getUserWatchlistRecord, [], { tags, revalidate });
    return await getCached(mediaType, mediaId, userId);
  } catch (error: any) {
    handleServerError(error, 'getting user watchlist record from cache');
    return null;
  }
};

const cacheWatchlistRecordTotalByMedia = async (mediaType: MediaType, mediaId: number): Promise<TotalResponse> => {
  try {
    const tags = endpoints.watchlistRecordTotalByMedia.tags.map((tag) =>
      tag.replace('{mediaType}', mediaType.toLowerCase()).replace('{mediaId}', mediaId.toString())
    );
    const getCached = unstable_cache(getWatchlistRecordTotalByMedia, [], { tags, revalidate });
    return await getCached(mediaType, mediaId);
  } catch (error: any) {
    handleServerError(error, 'getting watchlist record total from cache');
    return { total: 0 };
  }
};

const cacheWatchlistStatuesTotalByMedia = async (
  mediaType: MediaType,
  mediaId: number
): Promise<WatchStatusCount[]> => {
  try {
    const tags = endpoints.watchlistStatuesTotalByMedia.tags.map((tag) =>
      tag.replace('{mediaType}', mediaType.toLowerCase()).replace('{mediaId}', mediaId.toString())
    );
    const getCached = unstable_cache(getWatchlistStatuesTotalByMedia, [], { tags, revalidate });
    return await getCached(mediaType, mediaId);
  } catch (error: any) {
    handleServerError(error, 'getting watchlist statuses total from cache');
    return [];
  }
};

const cacheUserWatchlistRecordById = async (id: number): Promise<WatchlistRecord | null> => {
  try {
    const session = await getSession();
    if (!session?.user?.userId) return null;
    const record = await getUserWatchlistRecordById(id);
    const loader = async (id: number) => {
      logger.info('Fetching watchlist record with id form cache: ', id);
      return record;
    };
    const tags = endpoints.userWatchlistRecordById.tags.map((tag) =>
      tag.replace('{userId}', session.user.userId.toString()).replace('{id}', id.toString())
    );
    const getCached = unstable_cache(loader, [], { tags, revalidate });
    return await getCached(id);
  } catch (error: any) {
    handleServerError(error, 'getting user watchlist record from cache');
    return null;
  }
};

const cacheUserWatchlistByMedia = async (mediaType: MediaType, mediaId: number): Promise<WatchlistRecord | null> => {
  try {
    const session = await getSession();
    if (!session?.user?.userId) return null;
    const record = await getUserWatchlistByMedia(mediaType, mediaId);
    const loader = async (mediaType: MediaType, mediaId: number) => {
      logger.info('Fetching watchlist record with media form cache: ', mediaType, mediaId);
      return record;
    };
    const tags = endpoints.userWatchlistByMedia.tags.map((tag) =>
      tag
        .replace('{userId}', session.user.userId.toString())
        .replace('{mediaType}', mediaType.toLowerCase())
        .replace('{mediaId}', mediaId.toString())
    );
    const getCached = unstable_cache(loader, [], { tags, revalidate });
    return await getCached(mediaType, mediaId);
  } catch (error: any) {
    handleServerError(error, 'getting user watchlist record from cache');
    return null;
  }
};

/**
 * authenticated  get watchlist
 * @returns response<GeneralWatchlistRecord[]>
 */
const getWatchlist = async (): Promise<GeneralWatchlistRecord[]> => {
  const session = await getSession();
  if (!session?.user) return [];
  return cacheUserWatchlistByUserId(session.user.userId);
};

/**
 * authenticated get watchlist record
 * @param mediaType<MediaType>
 * @param mediaId<number>
 * @returns response<GeneralWatchlistRecord | null>
 */

const getUserWatchlistRecordByMedia = async (
  mediaType: MediaType,
  mediaId: number
): Promise<GeneralWatchlistRecord | null> => {
  const session = await getSession();
  if (!session?.user) return null;
  return cacheUserWatchlistRecord(mediaType?.toUpperCase() as any, mediaId, session.user.userId);
};

export {
  cacheUserWatchlistByUserId as getUserWatchlistByUserId,
  cacheUserWatchlistByUsername as getUserWatchlistByUsername,
  cacheUserWatchlistRecord as getUserWatchlistRecord,
  cacheWatchlistRecordTotalByMedia as getWatchlistRecordTotalByMedia,
  cacheWatchlistStatuesTotalByMedia as getWatchlistStatuesTotalByMedia,
  cacheUserWatchlistRecordById as getUserWatchlistRecordById,
  cacheUserWatchlistByMedia as getUserWatchlistByMedia,
  getWatchlist,
  getUserWatchlistRecordByMedia
};
