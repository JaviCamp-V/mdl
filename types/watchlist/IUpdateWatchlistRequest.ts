import MediaType from '../tmdb/IMediaType';
import PriorityLevel from './PriorityLevel';
import RewatchValue from './RewatchValue';
import WatchStatus from './WatchStatus';


export default interface UpdateWatchlistRequest {
  mediaId: number;
  mediaType: MediaType;
  watchStatus: WatchStatus;
  rating?: number | null;
  episodeWatched?: number | null;
  notes?: string | null;
  priority?: PriorityLevel | null;
  rewatchValue?: RewatchValue | null;
  rewatchCount?: number;
  startDate?: string | null;
  endDate?: string | null;
}