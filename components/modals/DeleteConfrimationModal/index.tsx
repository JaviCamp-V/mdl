import React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DefaultModal from '../DefaultModal';

interface DeleteConfirmationModalProps {
  open: boolean;
  itemName: string;
  onClose: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}
const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  open,
  onClose,
  onDelete,
  itemName,
  isDeleting
}) => {
  const content = (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
      <Typography fontSize={18} fontWeight={700} color="primary">
        {`Are you sure you want to delete this ${itemName}?`}
      </Typography>
      <Typography fontSize={14}>
        {`This action cannot be undone. This will permanently delete your ${itemName} and remove it from our servers.`}
      </Typography>
    </Box>
  );

  const actions = (
    <React.Fragment>
      <Button
        variant="contained"
        color="info"
        disabled={isDeleting}
        onClick={onClose}
        sx={{ textTransform: 'capitalize' }}
      >
        Cancel
      </Button>
      <LoadingButton
        loading={isDeleting}
        variant="contained"
        color="error"
        sx={{ textTransform: 'capitalize' }}
        onClick={onDelete}
      >
        Delete
      </LoadingButton>
    </React.Fragment>
  );

  return <DefaultModal open={open} onClose={onClose} content={content} actions={actions} />;
};

export default DeleteConfirmationModal;
