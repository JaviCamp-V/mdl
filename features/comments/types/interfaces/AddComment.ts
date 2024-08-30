import CommentType from '../enums/CommentType';

export interface CommentBody {
  content: string;
  hasSpoilers?: boolean;
}
export default interface AddComment extends CommentBody {
  parentId: number;
  commentType: CommentType;
}
