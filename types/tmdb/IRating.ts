export interface Rating {
  descriptors: string[];
  iso_3166_1: string; // Country code
  rating: string;
}

export default interface RatingResponse {
  id: number;
  results: Rating[];
}
