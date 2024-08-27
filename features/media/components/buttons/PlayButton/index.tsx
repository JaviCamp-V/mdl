'use client';

import React from 'react';
import { Video } from '@/features/media/types/interfaces/VideosResponse';
import Button from '@mui/material/Button';
import Iconify from '@/components/Icon/Iconify';
import VideoPlayerModal from '../../modals/VideoPlayer';

interface PlayButtonProps {
  video: Video;
}
const PlayButton: React.FC<PlayButtonProps> = ({ video }) => {
  const [isPlayerOpen, setIsPlayerOpen] = React.useState(false);
  return (
    <React.Fragment>
      <Button
        variant="contained"
        onClick={() => setIsPlayerOpen(true)}
        sx={{
          backgroundColor: 'info.main',
          color: 'info.contrastText',
          textTransform: 'capitalize',
          whiteSpace: "nowrap",
          gap: 0.5,
          '&:hover': { backgroundColor: 'info.dark' },
          '&:active': { backgroundColor: 'info.dark' }
        }}
      >
        <Iconify icon="mdi:play-circle" color={'#6cc788'} width={15} height={15} />
        {`Watch ${video.type}`}
      </Button>
      {isPlayerOpen && (
        <VideoPlayerModal
          open={isPlayerOpen}
          onClose={() => setIsPlayerOpen(false)}
          videoKey={video.key}
          name={video.name}
        />
      )}
    </React.Fragment>
  );
};

export default PlayButton;
