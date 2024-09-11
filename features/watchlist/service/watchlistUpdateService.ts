'use server';

import { revalidateTag } from 'next/cache';
import AccessLevel from '@/features/auth/types/enums/AccessLevel';
import withAuthMiddleware from '@/middleware/withAuthMiddleware';
import mdlApiClient from '@/clients/mdlApiClient';
import ErrorResponse from '@/types/common/ErrorResponse';
import GenericResponse from '@/types/common/GenericResponse';
import { getSession } from '@/utils/authUtils';
import handleServerError from '@/utils/handleServerError';
import logger from '@/utils/logger';
import UpdateWatchlistRequest from '../types/interfaces/UpdateWatchlistRequest';
import WatchlistRecordMetadata from '../types/interfaces/WatchlistRecordMetadata';
import { updateEndpoints as endpoints } from './endpoints';

type GenericResponseWithData = GenericResponse<WatchlistRecordMetadata>;

/**
 * Update & Create watchlist record
 * @param request<UpdateWatchlistRequest>
 * @returns response<GenericResponseWithData | ErrorResponse>
 * @throws ErrorResponse
 * @description Update or create a watchlist record and revalidate watchlist cache data
 */

const updateWatchlistRecord = async (
  request: UpdateWatchlistRequest
): Promise<GenericResponseWithData | ErrorResponse> => {
  try {
    logger.info('Updating watchlist record with : ', request.mediaType, request.mediaId);
    const { endpoint, tags } = endpoints.updateWatchlist;
    const response = await mdlApiClient.post<UpdateWatchlistRequest, GenericResponseWithData>(endpoint, request);
    const session = await getSession();
    const username = session?.user?.username!;
    const { mediaType, mediaId, userId, id } = response.data;
    tags.forEach((tag) =>
      revalidateTag(
        tag
          .replace('{userId}', userId.toString())
          .replace('{username}', username)
          .replace('{mediaType}', mediaType?.toLowerCase())
          .replace('{mediaId}', mediaId.toString())
          .replace('{id}', id.toLocaleString())
      )
    );
    return response;
  } catch (error: any) {
    return handleServerError(error, 'updating watchlist record');
  }
};

/**
 * Delete watchlist record
 * @param id<number>
 * @returns response<GenericResponseWithData | ErrorResponse>
 * @throws ErrorResponse
 * @description Delete a watchlist record and revalidate watchlist cache data
 */

const deleteWatchlistRecord = async (id: number): Promise<GenericResponseWithData | ErrorResponse> => {
  try {
    logger.info('Deleting watchlist record with id: ', id);
    const { endpoint, tags } = endpoints.deleteWatchlistRecordById;
    const endpointWithId = endpoint.replace(':id', id.toString());
    const response = await mdlApiClient.del<GenericResponseWithData>(endpointWithId);
    const session = await getSession();
    const username = session?.user?.username!;
    const { mediaType, mediaId, userId } = response.data;
    tags.forEach((tag) =>
      revalidateTag(
        tag
          .replace('{userId}', userId.toString())
          .replace('{username}', username)
          .replace('{mediaType}', mediaType?.toLowerCase())
          .replace('{mediaId}', mediaId.toString())
          .replace('{id}', id.toLocaleString())
      )
    );
    return response;
  } catch (error: any) {
    return handleServerError(error, 'deleting watchlist record');
  }
};

const authUpdateWatchlistRecord = withAuthMiddleware(updateWatchlistRecord, AccessLevel.MEMBER);
const authDeleteWatchlistRecord = withAuthMiddleware(deleteWatchlistRecord, AccessLevel.MEMBER);

export { authUpdateWatchlistRecord as updateWatchlistRecord, authDeleteWatchlistRecord as deleteWatchlistRecord };
