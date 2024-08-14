export interface Video {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: 'Trailer' | 'Teaser' | 'Clip' | 'Featurette' | 'Behind the Scenes' | 'Bloopers' | 'Other';
  official: boolean;
  published_at: string;
  id: string;
}

export default interface VideoResults {
  id: number;
  results: Video[];
}
