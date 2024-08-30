export default interface BaseShowDetails {
  adult: boolean;
  backdrop_path: string | null;
  id: number;
  original_language: string;
  origin_country: string[]; // added by me for movies, tv shows have this
  genre_ids: number[];
  keywords_ids: number[]; // added by me
  companies_ids: number[]; // added by me
  overview: string;
  popularity: number;
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
  recordId: number | null;
}
