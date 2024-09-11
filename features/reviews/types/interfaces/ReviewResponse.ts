import MediaDetailsProps from '@/types/common/MediaDetailsProps';
import ResponseAction from '@/types/enums/ResponseAction';
import ReviewType from '../enums/ReviewType';
import { ReviewBase } from './ReviewRequest';

export interface ReviewMetaData extends MediaDetailsProps {
  id: number;
  reviewType: ReviewType;
  season: number;
  episode: number;
  userId: number;
  action: ResponseAction;
}

export interface BaseReviewResponse extends ReviewBase {
  id: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  userId: number;
  commentCount: number;
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
