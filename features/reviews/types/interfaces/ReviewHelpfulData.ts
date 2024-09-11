import ResponseAction from '@/types/enums/ResposneAction';

export default interface ReviewHelpfulData {
  numberOfHelpfulReviews: number;
  numberOfUnhelpfulReviews: number;
}

export interface HelpfulRatingMetaData {
  id: number;
  reviewId: number;
  userId: number;
  action: ResponseAction;
}

export interface HelpfulRating {
  reviewId: number;
  helpful: boolean | null | undefined;
}

interface AddHelpful extends ReviewHelpfulData {
  isHelpful: boolean | null | undefined;
}
export interface withHelpful {
  helpful: AddHelpful;
}
