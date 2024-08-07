import React from 'react';
import { Box, Button, ButtonGroup, IconButton, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import Iconify from '@/components/Icon/Iconify';
import DramaPoster from '@/components/Poster';
import Socials from '@/components/Socials';
import ExternalID from '@/types/tmdb/IExternalID';
import Genre from '@/types/tmdb/IGenre';
import MediaType from '@/types/tmdb/IMediaType';
import { color } from '@/libs/common';
import Credits from '../Credits';
import Genres from './sections/Genres';
import MediaOverview from './sections/Overview';
import Score from './sections/Score';
import Tags from './sections/Tags';
import Titles from './sections/Titles';

interface DetailsTabPanelProps {
  id: number;
  poster_path: string | null;
  mediaType: MediaType.movie | MediaType.tv;
  genres: Genre[];
  overview: string;
  original_title: string;
  external_ids: ExternalID;
  vote_average: number;
  vote_count: number;
}
const DetailsTabPanel: React.FC<DetailsTabPanelProps> = ({
  id,
  poster_path,
  mediaType,
  overview,
  genres,
  original_title,
  external_ids,
  vote_average,
  vote_count
}) => {
  return (
    <Grid container spacing={3} sx={{ marginRight: 2, width: '90%' }}>
      <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box sx={{ width: '100%', height: { xs: '70vh', sm: '50vh' } }}>
          <DramaPoster src={poster_path} id={id} mediaType={mediaType} />
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '90%'
          }}
        >
          <Socials {...external_ids} />
        </Box>
        <ButtonGroup variant="contained" sx={{ width: '100%' }} size="large">
          <Button variant="contained" sx={{ width: '75%', textTransform: 'none' }}>
            {' '}
            Add to List
          </Button>
          <IconButton
            sx={{
              borderRadius: 0,
              borderBottomRightRadius: '4px',
              borderTopRightRadius: '4px',
              backgroundColor: 'primary.main',
              width: '25%'
            }}
          >
            <Iconify
              icon="material-symbols:list"
              sx={{
                color: color,
                fontSize: 72,
                width: 30,
                height: 30,
                fontWeight: 700
              }}
            />
          </IconButton>
        </ButtonGroup>
      </Grid>
      <Grid item xs={12} sm={8} sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        <Score vote_average={vote_average} vote_count={vote_count} />
        <MediaOverview id={id} type={mediaType} overview={overview} />
        <Box sx={{ display: 'flex', flexDirection: 'row', marginTop: 2 }}>
          <Typography fontWeight={700} paddingRight={1} fontSize={14}>
            Native Title:
          </Typography>
          <Typography fontSize={14}>{original_title}</Typography>
        </Box>
        <Titles id={id} mediaType={mediaType} />
        <Credits id={id} mediaType={mediaType} view="creator" />
        <Genres genres={genres} />
        <Tags id={id} mediaType={mediaType} />
      </Grid>
    </Grid>
  );
};

export default DetailsTabPanel;