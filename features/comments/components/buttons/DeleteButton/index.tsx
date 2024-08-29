import React from 'react';
import { deleteComment } from '@/features/comments/services/commentService';
import CommentType from '@/features/comments/types/enums/CommentType';
import { enqueueSnackbar } from 'notistack';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Iconify from '@/components/Icon/Iconify';
import DefaultModal from '@/components/modals/DefaultModal';
import { isErrorResponse } from '@/utils/handleError';

interface DeleteCommentButtonProps {
  isCommentOwner: boolean;
  commentType: CommentType;
  parentId: number;
  commentId: number;
}

const DeleteCommentButton: React.FC<DeleteCommentButtonProps> = ({
  isCommentOwner,
  commentType,
  parentId,
  commentId
}) => {
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  if (!isCommentOwner) return;

  const handleDelete = async () => {
    setLoading(true);
    const response = await deleteComment(commentType, parentId, commentId);
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
    <React.Fragment>
      <MenuItem onClick={() => setIsDeleteConfirmationOpen(true)}>
        <ListItemIcon>
          <Iconify icon="mdi:delete-outline" fontSize="small" color="text.primary" width={14} />
        </ListItemIcon>
        <ListItemText>Delete</ListItemText>
      </MenuItem>
      {isDeleteConfirmationOpen && (
        <DefaultModal
          open={isDeleteConfirmationOpen}
          onClose={() => setIsDeleteConfirmationOpen(false)}
          content={
            <Box
              sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 1 }}
            >
              <Typography fontSize={18} fontWeight={700} color="primary">
                Are you sure you want to delete this comment?
              </Typography>
              <Typography fontSize={14}>
                This action cannot be undone. This will permanently delete your comment and remove it from our servers.
              </Typography>
            </Box>
          }
          actions={
            <React.Fragment>
              <Button
                variant="contained"
                color="info"
                disabled={loading}
                onClick={() => setIsDeleteConfirmationOpen(false)}
                sx={{ textTransform: 'capitalize' }}
              >
                Cancel
              </Button>
              <LoadingButton
                loading={loading}
                variant="contained"
                color="error"
                sx={{ textTransform: 'capitalize' }}
                onClick={handleDelete}
              >
                Delete
              </LoadingButton>
            </React.Fragment>
          }
        />
      )}
    </React.Fragment>
  );
};

export default DeleteCommentButton;
