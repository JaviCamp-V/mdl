import { BaseSearchResponse } from './SearchResponse';

export interface Tags {
  id: number;
  name: string;
}

export default interface TagsResponse {
  id: number;
  keywords: Tags[];
  results: Tags[];
}

export interface TagsSearchResponse extends BaseSearchResponse<Tags> {}
