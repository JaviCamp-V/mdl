import ReviewType from '@/features/reviews/types/enums/ReviewType';
import { EpisodeReview, OverallReview } from '@/features/reviews/types/interfaces/ReviewResponse';
import MediaDetailsProps from '@/types/common/MediaDetailsProps';

export interface EpisodeReviewFormProps extends MediaDetailsProps {
  reviewType: ReviewType.EPISODE;
  seasonNumber: number;
  episodeNumber: number;
  review?: EpisodeReview | null;
}
export interface OverallReviewFormProps extends MediaDetailsProps {
  reviewType: ReviewType.OVERALL;
  review?: OverallReview | null;
}

export type WriteReviewFormMap = {
  [ReviewType.EPISODE]: Omit<EpisodeReviewFormProps, 'reviewType'>;
  [ReviewType.OVERALL]: Omit<OverallReviewFormProps, 'reviewType'>;
};

export type WriteReviewFormProps = EpisodeReviewFormProps | OverallReviewFormProps;

export default WriteReviewFormProps;
