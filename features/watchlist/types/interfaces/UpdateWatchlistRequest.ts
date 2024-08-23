import MediaType from '@/types/enums/IMediaType';
import WatchStatus from '@/types/enums/WatchStatus';
import PriorityLevel from '../enums/PriorityLevel';
import RewatchValue from '../enums/RewatchValue';

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
