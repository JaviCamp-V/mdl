export default interface ReviewHelpfulData {
  numberOfHelpfulReviews: number;
  numberOfUnhelpfulReviews: number;
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
