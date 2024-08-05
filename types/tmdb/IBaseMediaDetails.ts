export default interface BaseMediaItem {
  adult: boolean;
  backdrop_path: string | null;
  id: number;
  original_language: string;
  origin_country: string[];
  genre_ids: number[];
  overview: string;
  popularity: number;
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
}
