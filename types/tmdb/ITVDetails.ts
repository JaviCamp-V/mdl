import Genre from './IGenre';
import { Language } from './ITranslation';
import Network from './INetwork';
import { Creator } from './IPeople';
import ProductionCountry from './IProductionCountry';
import { Episode, Season } from './ISeason';
import BaseMediaItem from './IBaseMediaDetails';
import ExternalID from './IExternalID';

export default interface TVDetails extends BaseMediaItem {
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
  type: string;
  external_ids: ExternalID;
}
