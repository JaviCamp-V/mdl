interface BaseDiscoverSearchParams {
  include_adult?: boolean;
  language?: string; // ISO 639-1 code
  page?: number;
  sort_by?: string; // e.g., "popularity.asc", "popularity.desc", "vote_average.desc", "release_date.desc"
  vote_average_gte?: number;
  vote_average_lte?: number;
  vote_count_gte?: number;
  vote_count_lte?: number;
  watch_region?: string; // ISO 3166-1 code
  with_companies?: string; // Comma-separated company IDs
  with_genres?: string; // Comma-separated genre IDs
  with_keywords?: string; // Comma-separated keyword IDs
  with_origin_country?: string; // ISO 3166-1 code
  with_original_language?: string; // ISO 639-1 code
  with_runtime_gte?: number;
  with_runtime_lte?: number;
  with_watch_monetization_types?: string; // e.g., "flatrate", "free", "ads", "rent", "buy"
  with_watch_providers?: string; // Comma-separated watch provider IDs
  without_companies?: string; // Comma-separated company IDs
  without_genres?: string; // Comma-separated genre IDs
  without_keywords?: string; // Comma-separated keyword IDs
  without_watch_providers?: string; // Comma-separated watch provider IDs
}

export interface DiscoverTVSearchParams extends BaseDiscoverSearchParams {
  air_date_gte?: string; // ISO 8601 date format (YYYY-MM-DD)
  air_date_lte?: string; // ISO 8601 date format (YYYY-MM-DD)
  first_air_date_year?: number;
  first_air_date_gte?: string; // ISO 8601 date format (YYYY-MM-DD)
  first_air_date_lte?: string; // ISO 8601 date format (YYYY-MM-DD)
  include_null_first_air_dates?: boolean;
  screened_theatrically?: boolean;
  timezone?: string; // e.g., "America/New_York"
  with_networks?: string; // Comma-separated network IDs
  with_status?: string; // e.g., "Returning Series", "Planned", "In Production", "Ended", "Canceled", "Pilot"
  with_type?: string; // e.g., "documentary", "news", "miniseries", "reality"
}

export interface DiscoverMovieSearchParams extends BaseDiscoverSearchParams {
  certification?: string;
  certification_gte?: string;
  certification_lte?: string;
  certification_country?: string;
  include_video?: boolean;
  primary_release_year?: number;
  primary_release_date_gte?: string; // ISO 8601 date format (YYYY-MM-DD)
  primary_release_date_lte?: string; // ISO 8601 date format (YYYY-MM-DD)
  region?: string; // ISO 3166-1 code
  release_date_gte?: string; // ISO 8601 date format (YYYY-MM-DD)
  release_date_lte?: string; // ISO 8601 date format (YYYY-MM-DD)
  with_cast?: string; // Comma-separated person IDs
  with_crew?: string; // Comma-separated person IDs
  with_people?: string; // Comma-separated person IDs
  with_release_type?: string; // Comma-separated release type IDs
  year?: number;
}
