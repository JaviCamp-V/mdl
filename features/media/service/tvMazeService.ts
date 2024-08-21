'use server';

import tvMazeClient from '@/clients/tvMazeClient';
import logger from '@/utils/logger';
import TvMazeDetails from '../types/interfaces/TvMazeDetails';

const endpoints = {
  lookup: '/lookup/shows'
};
const lookupShow = async (
  id: number | string,
  lookup: 'thetvdb' | 'imdb' = 'thetvdb'
): Promise<TvMazeDetails | null> => {
  try {
    logger.info(`Looking up show with id: ${id}`);
    const params = new URLSearchParams({ [lookup]: id?.toString() });
    const response = await tvMazeClient.get<TvMazeDetails>(endpoints.lookup, params);
    return response;
  } catch (e: any) {
    logger.error(`Error looking up show with id: ${id} - ${e?.message}`);
    return null;
  }
};

export { lookupShow };
