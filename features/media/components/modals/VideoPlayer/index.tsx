import React from 'react';
import { generateYoutubeEmbedLink } from '@/features/media/utils/youtubeUtils';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import SlideTransition from '@/components/common/SlideTransition';

interface VideoPlayerModalProps {
  open: boolean;
  onClose: () => void;
  videoKey: string;
  name: string;
}
const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ open, onClose, videoKey, name }) => {
  return (
    <Dialog open={open} TransitionComponent={SlideTransition} onClose={onClose} maxWidth="md" scroll="body" fullWidth>
      <DialogContent
        sx={{ padding: 0, margin: 0, overflow: 'hidden', paddingBottom: '56.25%', position: 'relative', height: 0 }}
      >
        <iframe
          src={generateYoutubeEmbedLink(videoKey, true)}
          title={name}
          style={{ left: 0, top: 0, height: '100%', width: '100%', position: 'absolute', border: 'none' }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 3,
            top: 10,
            color: 'inherit'
          }}
        >
          <CloseIcon sx={{ width: 20, height: 20 }} />
        </IconButton>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayerModal;
