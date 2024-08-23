import WatchStatus from '@/types/enums/WatchStatus';

export default interface WatchlistHistory {
  id: number;
  watchStatus: WatchStatus;
  rating: number;
  episodeWatched: number;
  timestamp: string;
}
