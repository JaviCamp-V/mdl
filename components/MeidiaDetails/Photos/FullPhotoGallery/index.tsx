"use client";
import ItemPagination from '@/components/common/ItemPagination';
import DramaPoster from '@/components/Poster';
import { MediaImagesResponse } from '@/types/tmdb/IImage'
import { scrollToElementByID } from '@/utils/scrollToElement';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import React from 'react'

const FullPhotoGallery: React.FC<MediaImagesResponse> = ({ posters, backdrops, logos }) => {
  const photos = [...posters, ...backdrops, ...logos];
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
      <Box sx={{ borderBottom: '1px solid hsla(210, 8%, 51%, .13)', marginY: 1 }} />
      <ItemPagination totalItems={photos.length} itemsPerPage={28} currentPage={page} onPageChange={onPageChange} />
    </Box>
  );
};

export default FullPhotoGallery