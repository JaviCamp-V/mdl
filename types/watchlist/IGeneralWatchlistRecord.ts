import MediaType from '../tmdb/IMediaType';
import WatchStatus from './WatchStatus';

export default interface GeneralWatchlistRecord {
  id: number;
  mediaId: number;
  mediaType: MediaType.tv | MediaType.movie;
  watchStatus: WatchStatus;
  rating: number;
  episodeWatched: number;
  notes: string;
  updatedAt: string;
}

export interface WatchlistItems extends GeneralWatchlistRecord {
  title: string;
  country: string;
  year: number | string;
  isAiring: boolean;
  totalEpisodes: number;
  runtime: number;
}
