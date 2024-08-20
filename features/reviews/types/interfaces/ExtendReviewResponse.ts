import ReviewHelpfulData from './ReviewHelpfulData';
import { EpisodeReview, OverallReview } from './ReviewResponse';

interface withHelpful {
  helpful: ReviewHelpfulData;
}

export interface ExtendOverallReview extends OverallReview, withHelpful {}

export interface ExtendedEpisodeReview extends EpisodeReview, withHelpful {}

export interface ExtendOverallReviewWithMedia extends OverallReview {
  poster_path: string | null;
  title: string;
  origin: string;
}