import MediaType from './IMediaType';

export interface MediaRequest {
  id: number;
  mediaType: MediaType.tv | MediaType.movie;
}

export default interface GenericRequest {
  id: number;
  mediaType: MediaType;
}
