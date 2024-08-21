import MediaType from '../enums/IMediaType';

export default interface MediaDetailsProps {
  mediaType: MediaType.movie | MediaType.tv;
  mediaId: number;
}
