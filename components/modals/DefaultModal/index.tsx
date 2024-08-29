import React from 'react';
import { Breakpoint, Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import SlideTransition from '@/components/common/SlideTransition';

interface DefaultModalProps {
  open: boolean;
  onClose: () => void;
  content: React.ReactNode;
  actions?: React.ReactNode[] | React.ReactNode;
  maxWidth?: Breakpoint;
}

const DefaultModal: React.FC<DefaultModalProps> = ({ open, onClose, content, actions, maxWidth = 'xs' }) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={SlideTransition}
      onClose={onClose}
      maxWidth={maxWidth}
      scroll="body"
      fullWidth
    >
      <DialogContent sx={{ width: '100%', height: '100%', paddingX: 2 }}>{content}</DialogContent>
      <DialogActions
        sx={{
          paddingBottom: 2,
          paddingX: 2,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: { xs: 'center', sm: 'flex-end' },
          alignItems: 'center',
          gap: 1
        }}
      >
        {actions ? (
          actions
        ) : (
          <Button variant="outlined" onClick={onClose} sx={{ textTransform: 'capitalize' }}>
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DefaultModal;
