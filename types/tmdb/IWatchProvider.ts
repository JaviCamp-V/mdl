export interface Provider {
  display_priority: number;
  logo_path: string;
  provider_id: number;
  provider_name: string;
}

export interface WatchProvider {
  link: string;
  buy: Provider[];
  flatrate: Provider[];
  rent: Provider[];
}

export interface WatchLocale {
  [key: string]: WatchProvider;
}

export default interface WatchProviderResponse {
  id: number;
  results: WatchLocale;
}
