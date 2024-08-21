import WatchStatus from '@/types/enums/WatchStatus';
import BaseShowDetails from './BaseShowDetails';
import ExternalID from './ExternalID';
import Genre from './Genre';
import Network from './Network';
import ProductionCountry from './ProductionCountry';
import { Language } from './Translation';

export default interface MovieDetails extends BaseShowDetails {
  belongs_to_collection: any;
  budget: number;
  genres: Genre[];
  homepage: string;
  imdb_id: string;
  origin_country: string[];
  original_title: string;
  production_companies: Network[];
  production_countries: ProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: Language[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  external_ids: ExternalID;
  watchStatus: WatchStatus | null;
}
