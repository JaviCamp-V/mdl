import UserSummary from '@/types/common/UserSummary';
import WatchStatus from '@/types/enums/WatchStatus';
import ReviewType from '../enums/ReviewType';
import { ReviewBase } from './ReviewRequest';

export interface BaseReviewResponse extends ReviewBase {
  id: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  user: UserSummary;
  commentCount: number;
  watchStatus: WatchStatus | null;
  episodeWatched: number | null;
}

export interface EpisodeReview extends BaseReviewResponse {
  reviewType: ReviewType.EPISODE;
  season: number;
  episode: number;
}

export interface OverallReview extends BaseReviewResponse {
  reviewType: ReviewType.OVERALL;
  hasCompleted: boolean;
  storyRating: number;
  actingRating: number;
  musicRating: number;
  rewatchValueRating: number;
}
