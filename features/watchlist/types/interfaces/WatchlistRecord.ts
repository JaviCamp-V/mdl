import MediaType from '@/types/enums/IMediaType';
import WatchStatus from '@/types/enums/WatchStatus';
import PriorityLevel from '../enums/PriorityLevel';
import RewatchValue from '../enums/RewatchValue';
import WatchlistHistory from './WatchlistHistory';

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
