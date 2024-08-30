import React from 'react';
import { updateCommentLikes } from '@/features/comments/services/commentService';
import CommentType from '@/features/comments/types/enums/CommentType';
import { enqueueSnackbar } from 'notistack';
import { Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Iconify from '@/components/Icon/Iconify';
import { isErrorResponse } from '@/utils/handleError';

interface LikeCommentButtonProps {
  commentType: CommentType;
  parentId: number;
  commentId: number;
  likeCount: number;
  isCommentOwner: boolean;
  isAuthenticated: boolean;
  hasUserLiked: boolean;
}
const LikeCommentButton: React.FC<LikeCommentButtonProps> = ({
  likeCount,
  hasUserLiked,
  commentType,
  parentId,
  commentId,
  isAuthenticated,
  isCommentOwner
}) => {
  const [loading, setLoading] = React.useState(false);
  const onClick = async () => {
    if (loading) return;
    if (!isAuthenticated) {
      enqueueSnackbar('Please login to like', { variant: 'default' });
      return;
    }
    if (isCommentOwner) {
      enqueueSnackbar('You cannot like your own comment', { variant: 'default' });
      return;
    }
    setLoading(true);
    const response = await updateCommentLikes(commentType, parentId, commentId, !hasUserLiked);
    setLoading(false);
    if (isErrorResponse(response)) {
      response.errors.forEach((error) => {
        enqueueSnackbar(error.message, { variant: 'error' });
      });
      return;
    }
    enqueueSnackbar(response.message, { variant: 'success' });
  };
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 0.5 }}>
      <Tooltip title={hasUserLiked ? 'Unlike' : 'Like'}>
        <IconButton sx={{ margin: 0, padding: 0 }} onClick={onClick}>
          <Iconify
            icon="mdi:heart-outline"
            color={hasUserLiked ? '#f44455' : 'text.primary'}
            width={14}
            height={14}
            sx={{
              '&:hover': { opacity: 0.8, color: hasUserLiked ? 'text.primary' : '#f44455' }
            }}
          />
        </IconButton>
      </Tooltip>
      <Typography fontSize={14}>{likeCount}</Typography>
    </Box>
  );
};

export default LikeCommentButton;
