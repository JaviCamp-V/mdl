import ReviewHelpfulData from './ReviewHelpfulData';
import { EpisodeReview, OverallReview } from './ReviewResponse';

interface withHelpful {
  helpful: ReviewHelpfulData;
}

export interface ExtendOverallReview extends OverallReview, withHelpful {}

export interface ExtendedEpisodeReview extends EpisodeReview, withHelpful {}
