import MediaType from '@/types/enums/IMediaType';
import CommentType from '../types/enums/CommentType';

const mapMediaTypeToCommentType = (mediaType: MediaType): CommentType => {
  return {
    [MediaType.movie]: CommentType.MOVIE,
    [MediaType.tv]: CommentType.TV,
    [MediaType.person]: CommentType.PERSON
  }[mediaType];
};

const mapCommentTypeToMediaType = (commentType: CommentType): MediaType | null => {
  return {
    [CommentType.MOVIE]: MediaType.movie,
    [CommentType.TV]: MediaType.tv,
    [CommentType.PERSON]: MediaType.person,
    [CommentType.REVIEW]: null,
    [CommentType.COMMENT]: null
  }[commentType];
};

export { mapMediaTypeToCommentType, mapCommentTypeToMediaType };
