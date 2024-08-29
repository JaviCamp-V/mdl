import WatchStatus from '@/types/enums/WatchStatus';
import TVShowStatus from '../enums/TVShowStatus';
import TvShowType from '../enums/TvShowType';
import BaseShowDetails from './BaseShowDetails';
import ExternalID from './ExternalID';
import Genre from './Genre';
import Network from './Network';
import { Creator } from './People';
import ProductionCountry from './ProductionCountry';
import { Episode, Season } from './Season';
import { Language } from './Translation';

export default interface TVDetails extends BaseShowDetails {
  created_by: Creator[];
  episode_run_time: number[];
  first_air_date: string;
  genres: Genre[];

  homepage: string;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air?: Episode | null;
  name: string;
  next_episode_to_air?: Episode | null;
  networks: Network[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_name: string;
  production_companies: Network[];
  production_countries: ProductionCountry[];
  seasons: Season[];
  spoken_languages: Language[];
  status: TVShowStatus;
  tagline: string;
  type: TvShowType;
  external_ids: ExternalID;
  watchStatus: WatchStatus | null;
}
