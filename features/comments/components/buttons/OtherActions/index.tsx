import React from 'react';
import CommentType from '@/features/comments/types/enums/CommentType';
import IconButton from '@mui/material/IconButton';
import Iconify from '@/components/Icon/Iconify';
import DropDownMenu from '@/components/common/DropdownMenu';
import DeleteCommentButton from '../DeleteButton';
import EditCommentButton from '../EditButton';
import ReportCommentButton from '../ReportButton';
import ShareCommentButton from '../ShareButton';

interface CommentsOtherActionsProps {
  commentId: number;
  commentType: CommentType;
  parentId: number;
  openEditForm: () => void;
  isAuthenticated: boolean;
  isCommentOwner: boolean;
}

const CommentsOtherActions: React.FC<CommentsOtherActionsProps> = ({
  commentType,
  parentId,
  commentId,
  openEditForm,
  isAuthenticated,
  isCommentOwner
}) => {
  const options = [
    <ShareCommentButton key="share" commentId={commentId} />,
    <EditCommentButton key="edit" toggleEdit={openEditForm} isCommentOwner={isCommentOwner} />,
    <DeleteCommentButton
      key="delete"
      isCommentOwner={isCommentOwner}
      commentType={commentType}
      parentId={parentId}
      commentId={commentId}
    />,
    <ReportCommentButton
      key="report"
      commentId={commentId}
      isAuthenticated={isAuthenticated}
      isCommentOwner={isCommentOwner}
    />
  ];

  return (
    <DropDownMenu menuItems={options}>
      <IconButton sx={{ margin: 0, padding: 0 }}>
        <Iconify icon="mdi:more-vert" width={14} color="text.primary" />
      </IconButton>
    </DropDownMenu>
  );
};

export default CommentsOtherActions;
