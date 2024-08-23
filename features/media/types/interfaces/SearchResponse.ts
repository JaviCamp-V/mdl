import MediaType from '@/types/enums/IMediaType';
import BaseShowDetails from './BaseShowDetails';
import { PersonBase } from './People';
import { Video } from './VideosResponse';

export interface MovieSearchResult extends BaseShowDetails {
  media_type: MediaType.movie;
  title: string;
  original_title: string;
  genre_ids: number[];
  release_date: string;
  video: boolean;
  trailer?: Video | null;
}

export interface TVSearchResult extends BaseShowDetails {
  media_type: MediaType.tv;
  name: string;
  original_name: string;
  genre_ids: number[];
  first_air_date: string;
  origin_country: string[];
  episode_count: number;
  trailer?: Video | null;
}

export type MediaSearchResult = TVSearchResult | MovieSearchResult;

export interface PersonSearchResult extends PersonBase {
  media_type: MediaType.person;
  popularity: number;
  known_for_department: string;
  known_for: MediaSearchResult[];
  biography: string;
  place_of_birth: string;
}
interface BaseSearchResponse<T> {
  page: number;
  results: T[];
  total_results: number;
  total_pages: number;
}

export interface TVSearchResponse extends BaseSearchResponse<TVSearchResult> {}
export interface MovieSearchResponse extends BaseSearchResponse<MovieSearchResult> {}
export interface PersonSearchResponse extends BaseSearchResponse<PersonSearchResult> {}
export default interface SearchResponse extends BaseSearchResponse<MediaSearchResult | PersonSearchResult> {}
