import { withUserSummary } from '@/types/common/UserSummary';
import WatchStatus from '@/types/enums/WatchStatus';
import { withHelpful } from './ReviewHelpfulData';
import { EpisodeReview, OverallReview } from './ReviewResponse';

interface withWatchRecord {
  watchStatus: WatchStatus | null;
  episodeWatched: number | null;
}

interface withMedia {
  poster_path: string | null;
  title: string;
  number_of_episodes?: number | null;
}

export interface ExtendOverallReview extends OverallReview, withUserSummary, withHelpful, withWatchRecord {}

export interface ExtendedEpisodeReview extends EpisodeReview, withUserSummary, withHelpful {}

export interface ExtendOverallReviewWithMediaAndUser extends OverallReview, withUserSummary, withMedia {}

export interface ExtendOverallReviewWithMediaHelpful extends OverallReview, withHelpful, withMedia, withWatchRecord {}
export interface ExtendEpisodeReviewWithMediaHelpful extends EpisodeReview, withHelpful, withMedia {}
