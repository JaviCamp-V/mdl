import BaseMediaItem from "./IBaseMediaDetails";
import MediaType from "./IMediaType";
import { PersonBase } from "./IPeople";

export interface MovieSearchResult extends BaseMediaItem {
  media_type: MediaType.movie;
  title: string;
  original_title: string;
  genre_ids: number[];
  release_date: string;
  video: boolean;
}

export interface TVSearchResult extends BaseMediaItem {
  media_type: MediaType.tv;
  name: string;
  original_name: string;
  genre_ids: number[];
  first_air_date: string;
  origin_country: string[];
}

export type MediaSearchResult = TVSearchResult | MovieSearchResult;

export interface PersonSearchResult extends PersonBase {
  media_type: MediaType.person;
  popularity: number;
  known_for_department: string;
  known_for: MediaSearchResult [];
}

export default interface SearchResponse {
    page: number;
    results: MediaSearchResult[] | PersonSearchResult[];
    total_results: number;
    total_pages: number;
}