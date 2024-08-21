'use client';

import React from 'react';
import { MediaImagesResponse } from '@/features/media/types/interfaces/ImageResponse';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import DramaPoster from '@/components/Poster';
import Divider from '@/components/common/Divider';
import ItemPagination from '@/components/common/ItemPagination';
import { scrollToElementByID } from '@/utils/scrollToElement';

const FullPhotoGallery: React.FC<MediaImagesResponse> = ({ posters, backdrops }) => {
  const photos = [...posters, ...backdrops];
  const [page, setPage] = React.useState(1);
  const showing = photos.slice((page - 1) * 28, page * 28);

  const onPageChange = (page: number) => {
    setPage(page);
    scrollToElementByID('slide-show');
  };
  return (
    <Box sx={{ padding: 2 }}>
      <Grid container spacing={3} sx={{ width: '100%', marginRight: 2 }} id="slide-show">
        {showing.map((poster) => (
          <Grid item key={poster.file_path} xs={12} sm={6} md={3}>
            <Box sx={{ width: '100%', height: '35vh' }}>
              <DramaPoster src={poster.file_path} id={poster.file_path} mediaType="photo" size="original" />
            </Box>
          </Grid>
        ))}
      </Grid>
      {photos.length > 28 && (
        <React.Fragment>
          <Divider />
          <ItemPagination totalItems={photos.length} itemsPerPage={28} currentPage={page} onPageChange={onPageChange} />
        </React.Fragment>
      )}
    </Box>
  );
};

export default FullPhotoGallery;
