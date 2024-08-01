'use server';
import tvMazeClient from '@/clients/tvMazeClient';
import TVShowDetails from '@/types/tvMaze/ITVShowsDetails';

const endpoints = {
  lookup: '/lookup/shows'
};
const lookupShow = async (
  id: number | string,
  lookup: 'thetvdb' | 'imdb' = 'thetvdb'
): Promise<TVShowDetails | null> => {
  try {
    const params = new URLSearchParams({ [lookup]: id.toString() });
    return tvMazeClient.get<TVShowDetails>(endpoints.lookup, params);
  } catch (e) {
    console.error(e);
    return null;
  }
};

export { lookupShow };
