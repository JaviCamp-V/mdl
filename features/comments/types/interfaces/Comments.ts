import GenericPage from '@/types/common/GenericPage';
import UserSummary from '@/types/common/UserSummary';
import CommentType from '../enums/CommentType';
import AddComment from './AddComment';

export interface CommentMeta {
  commentType: CommentType;
  parentId: number;
  id: number;
  deleted: boolean;
  updatedAt: string;
  userId: number;
}
export default interface Comment extends AddComment, CommentMeta {
  mention: CommentMeta;
  createdAt: string;
}

export interface CommentPage extends GenericPage<Comment> {}
