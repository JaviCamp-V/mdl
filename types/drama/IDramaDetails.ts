interface Genre {
  id: number;
  name: string;
}

interface Network {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

interface ProductionCompany {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

interface Season {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  vote_average: number;
}

interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

interface NextEpisodeToAir {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  air_date: string;
  episode_number: number;
  episode_type: string;
  production_code: string;
  runtime: number | null;
  season_number: number;
  show_id: number;
  still_path: string | null;
}

interface ImageCollection {
  backdrops: any[]; // Specify the type if known
  logos: any[]; // Specify the type if known
  posters: any[]; // Specify the type if known
}

interface AlternativeTitle {
  iso_3166_1: string;
  title: string;
  type: string;
}

interface AlternativeTitles {
  results: AlternativeTitle[];
}

interface CastMember {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null; // `profile_path` can be null if not available
  roles: {
    credit_id: string;
    character: string;
    episode_count: number;
  }[];
  total_episode_count: number;
  order: number;
}

interface CrewMember {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null; // `profile_path` can be null if not available
  jobs: {
    credit_id: string;
    job: string;
    episode_count: number;
  }[];
  department: string;
  total_episode_count: number;
}

interface TVShowCredits {
  cast: CastMember[];
  crew: CrewMember[];
  id: number;
}

interface TVShowExternalIds {
  imdb_id: string | null;
  freebase_mid: string | null;
  freebase_id: string | null;
  tvdb_id: number | null;
  tvrage_id: number | null;
  wikidata_id: string | null;
  facebook_id: string | null;
  instagram_id: string | null;
  twitter_id: string | null;
}


export interface Provider {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

interface Country {
  link: string;
  ads?: Provider[];
  flatrate?: Provider[];
}

interface WatchProviders {
  id: number;
  results: {
    [key: string]: Country;
  };
}
export default interface DramaDetails {
  adult: boolean;
  backdrop_path: string;
  created_by: any[]; // Specify the type if known
  episode_run_time: number[]; // Specify the type if known
  first_air_date: string;
  genres: Genre[];
  homepage: string;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string | null;
  last_episode_to_air: any | null; // Specify the type if known
  name: string;
  next_episode_to_air: NextEpisodeToAir;
  networks: Network[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  seasons: Season[];
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  type: string;
  vote_average: number;
  vote_count: number;
  images: ImageCollection;
  alternative_titles: AlternativeTitles;
  aggregate_credits: TVShowCredits;
  external_ids: TVShowExternalIds;
  'watch/providers': WatchProviders;
}
