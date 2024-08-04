export interface Image  {
  aspect_ratio: number;
  file_path: string;
  height: number;
  iso_639_1: string;
  vote_average: number;
  vote_count: number;
  width: number;
};

export interface MediaImagesResponse {
  id: number;
  backdrops: Image[];
  logos: Image[];
  posters: Image[];
};

export interface PersonImagesResponse {
    id: number;
    profiles: Image[];
}


type ImagesResponse = MediaImagesResponse | PersonImagesResponse;

export default ImagesResponse;
