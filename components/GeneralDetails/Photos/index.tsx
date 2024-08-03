import { getImages } from '@/server/tmdb2Actions';
import { MediaRequest } from '@/types/tmdb/IGenericRequest';
import React from 'react';
import PhotosOverview from './PhotosOverview';
import { Box } from '@mui/material';
import FullPhotoGallery from './FullPhotoGallery';

interface PhotosProps extends MediaRequest {
  view: 'overview' | 'all';
}
const Photos: React.FC<PhotosProps> = async ({ id, mediaType, view }) => {
  const photos = await getImages(mediaType, id);

  if (!photos) return <Box sx={{ padding: 2, textAlign: 'center' }}>No photos found</Box>;

  if (view === 'overview') return <PhotosOverview {...photos} mediaType={mediaType} />;
  return <FullPhotoGallery {...photos} />;
};

export default Photos;
