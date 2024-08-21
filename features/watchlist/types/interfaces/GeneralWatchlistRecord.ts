import MediaType from '@/types/enums/IMediaType';
import WatchStatus from '@/types/enums/WatchStatus';

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
