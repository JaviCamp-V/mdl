import Genre from '@/features/media/types/interfaces/Genre';
import GeneralWatchlistRecord from './GeneralWatchlistRecord';

export default interface WatchlistItems extends GeneralWatchlistRecord {
  title: string;
  originalTitle: string;
  country: string;
  year: number | string;
  isAiring: boolean;
  totalEpisodes: number;
  runtime: number;
  posterPath: string | null;
  genres: Genre[];
  overview: string | null;
  voteAverage: number;
}
