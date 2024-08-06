'use server';

import tvMazeClient from '@/clients/tvMazeClient';
import TVShowDetails from '@/types/tvMaze/ITVShowsDetails';
import logger from '@/utils/logger';


const endpoints = {
  lookup: '/lookup/shows'
};
const lookupShow = async (
  id: number | string,
  lookup: 'thetvdb' | 'imdb' = 'thetvdb'
): Promise<TVShowDetails | null> => {
  try {
    logger.info(`Looking up show with id: ${id}`);
    const params = new URLSearchParams({ [lookup]: id.toString() });
    const response = await tvMazeClient.get<TVShowDetails>(endpoints.lookup, params);
    return response;
  } catch (e: any) {
    logger.error(`Error looking up show with id: ${id} - ${e?.message}`);
    return null;
  }
};

export { lookupShow };