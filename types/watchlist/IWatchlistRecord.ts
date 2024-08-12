import MediaType from '../tmdb/IMediaType';
import WatchlistHistory from './IWatchlistHistory';
import PriorityLevel from './PriorityLevel';
import RewatchValue from './RewatchValue';
import WatchStatus from './WatchStatus';

export default interface WatchlistRecord {
  id: number;
  mediaId: number;
  mediaType: MediaType;
  watchStatus: WatchStatus;
  rating: number;
  episodeWatched: number;
  notes: string;
  priority: PriorityLevel;
  rewatchValue: RewatchValue;
  rewatchCount: number;
  startDate: string;
  endDate: string;
  addedAt: string;
  updatedAt: string;
  history: WatchlistHistory[];
}
