import React from 'react';
import Link from 'next/link';
import { MediaImagesResponse } from '@/features/media/types/interfaces/ImageResponse';
import { Box, Grid, Typography } from '@mui/material';
import DramaPoster from '@/components/Poster';
import MediaType from '@/types/enums/IMediaType';

const PhotosOverview: React.FC<MediaImagesResponse & { mediaType: MediaType }> = ({
  id,
  mediaType,
  posters,
  backdrops
}) => {
  const photos = [...posters, ...backdrops];
  return (
    <Box sx={{ padding: 2 }}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
      >
        <Typography fontSize={16} fontWeight={700} lineHeight={1}>
          Photos
        </Typography>
        <Link href={`/${mediaType}/${id}/photos`} style={{ textDecoration: 'none' }} passHref>
          <Typography fontSize={13} fontWeight={700} color="#1675b6" textAlign={'center'}>
            {`View all (${photos.length})`}
          </Typography>
        </Link>
      </Box>
      <Grid container spacing={2} sx={{ marginTop: 0 }}>
        {photos.slice(0, 6).map((poster) => (
          <Grid item key={poster.file_path} xs={4} md={2}>
            <Box
              sx={{
                width: { xs: '100%', md: '100%' },
                height: { xs: '15vh', sm: '25vh' }
              }}
            >
              <DramaPoster src={poster.file_path} id={poster.file_path} mediaType={'photo'} size="w342" />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PhotosOverview;
