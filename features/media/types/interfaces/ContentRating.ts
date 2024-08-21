export interface ContentRating {
  descriptors: string[];
  iso_3166_1: string; // Country code
  rating: string;
}

export default interface ContentRatingResponse {
  id: number;
  results: ContentRating[];
}
