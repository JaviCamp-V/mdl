import MediaType from '../tmdb/IMediaType';

export default interface MediaDetailsProps {
  mediaType: MediaType.movie | MediaType.tv;
  mediaId: number;
}
