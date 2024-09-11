import MediaType from '@/types/enums/IMediaType';
import ResponseAction from '@/types/enums/ResponseAction';

export default interface WatchlistRecordMetadata {
  id: number;
  mediaType: MediaType;
  mediaId: number;
  userId: number;
  responseAction: ResponseAction;
}
