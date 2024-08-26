import { BaseSearchResponse } from './SearchResponse';

export default interface Network {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

export interface NetworksSearchResponse extends BaseSearchResponse<Network> {}

// Also production company
