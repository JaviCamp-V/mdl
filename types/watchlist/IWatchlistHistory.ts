import WatchStatus from './WatchStatus';

export default interface WatchlistHistory {
  id: number;
  watchStatus: WatchStatus;
  rating: number;
  episodeWatched: number;
  timestamp: string;
}
