'use client';

import React from 'react';
import CommentType from '@/features/comments/types/enums/CommentType';
import { enqueueSnackbar } from 'notistack';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Iconify from '@/components/Icon/Iconify';
import AddCommentForm from '../../forms/AddComment';
import LikeCommentButton from '../LikeButton';
import CommentsOtherActions from '../OtherActions';

interface CommentButtonsProps {
  commentType: CommentType;
  parentId: number;
  commentId: number;
  isCommentOwner: boolean;
  likeCount: number;
  hasUserLiked: boolean;
  onEditClick: () => void;
  isAuthenticated: boolean;
}
const CommentButtons: React.FC<CommentButtonsProps> = ({
  commentType,
  parentId,
  commentId,
  isCommentOwner,
  likeCount,
  hasUserLiked,
  onEditClick,
  isAuthenticated
}) => {
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  const onReplyClick = () => {
    if (!isAuthenticated) {
      enqueueSnackbar('Please login to reply', { variant: 'default' });
      return;
    }
    setIsFormOpen((prev) => !prev);
  };
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
        <LikeCommentButton
          commentId={commentId}
          likeCount={likeCount}
          hasUserLiked={hasUserLiked}
          isAuthenticated={isAuthenticated}
          isCommentOwner={isCommentOwner}
        />
        <IconButton onClick={onReplyClick} sx={{ gap: 0.5 }}>
          <Iconify icon="mdi:comment-outline" color="text.primary" width={14} />
          <Typography fontSize={14} color="text.primary">
            Reply
          </Typography>
        </IconButton>
        <CommentsOtherActions
          commentId={commentId}
          commentType={commentType}
          parentId={parentId}
          isCommentOwner={isCommentOwner}
          isAuthenticated={isAuthenticated}
          openEditForm={onEditClick}
        />
      </Box>
      {isAuthenticated && isFormOpen && (
        <Box sx={{ width: '100%', paddingY: 1 }}>
          <AddCommentForm commentType={CommentType.COMMENT} parentId={commentId} onClose={() => setIsFormOpen(false)} />
        </Box>
      )}
    </Box>
  );
};

export default CommentButtons;
