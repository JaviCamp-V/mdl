import { withUserSummary } from '@/types/common/UserSummary';
import WatchStatus from '@/types/enums/WatchStatus';
import { withHelpful } from './ReviewHelpfulData';
import { EpisodeReview, OverallReview } from './ReviewResponse';

interface withWatchRecord {
  watchStatus: WatchStatus | null;
  episodeWatched: number | null;
}

export interface ExtendOverallReview extends OverallReview, withUserSummary, withHelpful, withWatchRecord {}

export interface ExtendedEpisodeReview extends EpisodeReview, withUserSummary, withHelpful {}

export interface ExtendOverallReviewWithMedia extends OverallReview, withUserSummary {
  poster_path: string | null;
  title: string;
  origin: string;
}
