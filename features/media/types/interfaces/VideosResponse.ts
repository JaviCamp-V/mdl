import VideoType from '../enums/VideoType';

export interface Video {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: VideoType;
  official: boolean;
  published_at: string;
  id: string;
}

export default interface VideoResults {
  id: number;
  results: Video[];
}
