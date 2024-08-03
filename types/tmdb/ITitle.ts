export interface Title {
  iso_3166_1: string;
  title: string;
  type: string;
}

export default interface TitleResponse {
  id: number;
  titles?: Title[];
  results?: Title[];
}
