'use server';

import { getValidContentDetails } from '@/features/media/service/tmdbViewService';
import MediaType from '@/types/enums/IMediaType';
import { formatStringDate } from '@/utils/formatters';
import logger from '@/utils/logger';
import GeneralWatchlistRecord from '../types/interfaces/GeneralWatchlistRecord';
import WatchlistItems from '../types/interfaces/WatchlistItem';
import { getUserWatchlistByUserId } from './watchlistViewService';

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
const addAddDetailsToWatchlist = async (watchlist: GeneralWatchlistRecord): Promise<WatchlistItems | null> => {
  try {
    const type = watchlist.mediaType.toLowerCase() as any;
    logger.info(`Fetching details for watchlist item with mediaType: ${type}, mediaId: ${watchlist.mediaId}`);

    const details = await getValidContentDetails(type, watchlist.mediaId);
    if (!details) return null;

    const { poster_path, genres, overview, vote_average = 0, vote_count = 0 } = details;

    const anyDetails = details as any;
    const title = details?.title ?? details?.name;
    const originalTitle = details?.original_title ?? anyDetails?.original_name;
    const country = details.origin_country.length ? details.origin_country[0] : 'Unknown';
    const releaseDate = details.release_date ?? details.first_air_date;
    const year = releaseDate ? formatStringDate(releaseDate).getFullYear() : 'TBA';
    const isAiring = details?.status === 'Returning Series';
    const totalEpisodes = details?.number_of_episodes ?? 1;
    const runtime = type === MediaType.tv ? details?.episode_run_time[0] : details?.runtime;
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

const getUserWatchlistByIdWithMedia = async (userId: number): Promise<WatchlistItems[]> => {
  try {
    const watchlist = await getUserWatchlistByUserId(userId);
    const watchlistWithDetails = await Promise.all(watchlist.map(addAddDetailsToWatchlist));
    return watchlistWithDetails.filter((item) => item !== null) as WatchlistItems[];
  } catch (error: any) {
    logger.error(`Error fetching watchlist for user: ${error?.message}, ${error?.response?.data?.message}`);
    return [];
  }
};

export { getUserWatchlistByIdWithMedia };
