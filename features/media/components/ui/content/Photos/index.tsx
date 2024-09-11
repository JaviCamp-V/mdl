'use server';

import React from 'react';
import { getImages } from '@/features/media/service/tmdbViewService';
import Box from '@mui/material/Box';
import MediaDetailsProps from '@/types/common/MediaDetailsProps';
import FullPhotoGallery from './FullPhotoGallery';
import PhotosOverview from './PhotosOverview';


interface PhotosProps extends MediaDetailsProps {
  view: 'overview' | 'all';
}
const Photos: React.FC<PhotosProps> = async ({ mediaId, mediaType, view }) => {
  const photos = await getImages(mediaType, mediaId);

  if (!photos) return <Box sx={{ padding: 2, textAlign: 'center' }}>No photos found</Box>;

  if (view === 'overview') return <PhotosOverview {...photos} mediaType={mediaType} />;

  return <FullPhotoGallery {...photos} />;
};

export default Photos;