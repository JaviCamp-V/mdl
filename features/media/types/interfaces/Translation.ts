export interface Language {
  iso_639_1: string;
  name: string;
  english_name: string;
}

export interface TranslationData {
  name: string;
  overview: string;
  homepage: string;
  tagline: string;
}

export interface Translation extends Language {
  iso_3166_1: string;
  data: TranslationData;
}

export default interface TranslationResponse {
  id: number;
  translations: Translation[];
}
