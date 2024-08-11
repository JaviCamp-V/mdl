'use server';

import { revalidatePath } from 'next/cache';
import mdlApiClient from '@/clients/mdlApiClient';
import ErrorResponse from '@/types/common/ErrorResponse';
import GenericResponse from '@/types/common/GenericResponse';
import GeneralWatchlistRecord from '@/types/watchlist/IGeneralWatchlistRecord';
import UpdateWatchlistRequest from '@/types/watchlist/IUpdateWatchlistRequest';
import WatchlistRecord from '@/types/watchlist/IWatchlistRecord';
import logger from '@/utils/logger';

const baseUrl = 'user/watchlist';
const endpoints = {
  byId: '/:id',
  byMedia: '/{mediaType}/{mediaId}'
};

const updateWatchlistRecord = async (request: UpdateWatchlistRequest): Promise<GenericResponse | ErrorResponse> => {
  try {
    logger.info('Updating watchlist record with : ', request.mediaType, request.mediaId);
    const response = await mdlApiClient.post<UpdateWatchlistRequest, GenericResponse>(baseUrl, request);
    revalidatePath('/', 'layout');
    return response;
  } catch (error: any) {
    console.log(error);
    logger.error(`Error updating watchlist record: ${error?.message}, ${error?.response?.data?.message}`);
    return error.response.data ?? error;
  }
};

const getWatchlist = async (): Promise<GeneralWatchlistRecord[]> => {
  try {
    logger.info('Fetching watchlist');
    return await mdlApiClient.get<GeneralWatchlistRecord[]>(baseUrl);
  } catch (error: any) {
    logger.error(`Error fetching watchlist: ${error?.message}, ${error?.response?.data?.message}`);
    return [];
  }
};

const getWatchlistRecord = async (id: number): Promise<WatchlistRecord | null | ErrorResponse> => {
  try {
    logger.info('Fetching watchlist record with id: ', id);
    const endpoint = baseUrl + endpoints.byId.replace(':id', id.toString());
    console.log('endpoint: ', endpoint);
    return await mdlApiClient.get<WatchlistRecord>(endpoint);
  } catch (error: any) {
    console.log(error);
    logger.error(`Error fetching watchlist record: ${error?.message}, ${error?.response?.data?.message}`);
    return error.response.data ?? error;
  }
};

const getWatchlistRecordByMedia = async (
  mediaType: string,
  mediaId: number
): Promise<WatchlistRecord | null | ErrorResponse> => {
  try {
    logger.info('Fetching watchlist record with mediaType: ', mediaType, ' mediaId: ', mediaId);
    const endpoint =
      baseUrl + endpoints.byMedia.replace('{mediaType}', mediaType).replace('{mediaId}', mediaId.toString());
    return await mdlApiClient.get<WatchlistRecord>(endpoint);
  } catch (error: any) {
    logger.error(`Error fetching watchlist record: ${error?.message}, ${error?.response?.data?.message}`);
    return error.response.data ?? error;
  }
};
const deleteWatchlistRecord = async (id: number): Promise<GenericResponse | ErrorResponse> => {
  try {
    logger.info('Deleting watchlist record with id: ', id);
    const endpoint = baseUrl + endpoints.byId.replace(':id', id.toString());
    const response = await mdlApiClient.del<GenericResponse>(endpoint);
    revalidatePath('/', 'layout');
    return response;
  } catch (error: any) {
    logger.error(`Error deleting watchlist record: ${error?.message}, ${error?.response?.data?.message}`);
    return error.response.data ?? error;
  }
};

export { updateWatchlistRecord, getWatchlist, getWatchlistRecord, getWatchlistRecordByMedia, deleteWatchlistRecord };
