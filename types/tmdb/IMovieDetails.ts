import BaseMediaItem from './IBaseMediaDetails';
import ExternalID from './IExternalID';
import Genre from './IGenre';
import Network from './INetwork';
import ProductionCountry from './IProductionCountry';
import { Language } from './ITranslation';

export default interface MovieDetails extends BaseMediaItem {
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
}
