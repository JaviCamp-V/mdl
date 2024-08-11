import MediaType from '../tmdb/IMediaType';
import WatchStatus from './WatchStatus';

export default interface GeneralWatchlistRecord {
  id: number;
  mediaId: number;
  mediaType: MediaType;
  watchStatus: WatchStatus;
  rating: number;
  episodeWatched: number;
  notes: string;
  updatedAt: string;
}
