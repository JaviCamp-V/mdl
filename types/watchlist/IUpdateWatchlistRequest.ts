import MediaType from '../tmdb/IMediaType';
import PriorityLevel from './PriorityLevel';
import RewatchValue from './RewatchValue';
import WatchStatus from './WatchStatus';


export default interface UpdateWatchlistRequest {
  mediaId: number;
  mediaType: MediaType;
  watchStatus: WatchStatus;
  rating?: number;
  episodeWatched?: number;
  notes?: string;
  priority?: PriorityLevel;
  rewatchValue?: RewatchValue;
  rewatchCount?: number;
  startDate?: string;
  endDate?: string;
}