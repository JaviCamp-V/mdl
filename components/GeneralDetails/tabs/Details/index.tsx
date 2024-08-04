import DramaPoster from '@/components/Poster';
import MediaType from '@/types/tmdb/IMediaType';
import Grid from '@mui/material/Grid';
import React from 'react'
import MediaOverview from './sections/Overview';
import { Box, Button, ButtonGroup, IconButton, Typography } from '@mui/material';
import Tags from './sections/Tags';
import Genre from '@/types/tmdb/IGenre';
import Genres from './sections/Genres';
import Titles from './sections/Titles';
import CrewSummary from '../../Credits/CrewSummary';
import Iconify from '@/components/Icon/Iconify';
import Credits from '../../Credits';

interface DetailsTabPanelProps {
  id: number;
  poster_path: string | null;
  mediaType: MediaType.movie | MediaType.tv;
  genres: Genre[];
  overview: string;
  original_title: string;
}
const DetailsTabPanel: React.FC<DetailsTabPanelProps> = ({ id, poster_path, mediaType, overview, genres, original_title }) => {
  const color = 'hsl(0deg 0% 100% / 87%)';
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ width: '90%', height: { xs: '70vh', sm: '50vh' } }}>
          <DramaPoster src={poster_path} id={id} mediaType={mediaType} />
        </Box>
        <ButtonGroup variant="contained" sx={{ width: '90%' }} size="large">
          <Button variant="contained" sx={{ width: '75%' }}>
            {' '}
            Add to List
          </Button>
          <IconButton
            sx={{
              borderRadius: 0,
              borderBottomRightRadius: '4px',
              borderTopRightRadius: '4px',
              backgroundColor: '#1976d2',
              width: '25%'
            }}
          >
            <Iconify
              icon="material-symbols:list"
              sx={{ color, fontSize: 72, width: 30, height: 30, fontWeight: 500 }}
            />
          </IconButton>
        </ButtonGroup>
      </Grid>
      <Grid item xs={12} sm={8} sx={{ display: 'flex', flexDirection: 'column', gap: 0, width: '90%' }}>
        <MediaOverview id={id} type={mediaType} overview={overview} />
        <Box sx={{ display: 'inline', whiteSpace: 'pre-line', marginTop: 2 }}>
          <Typography sx={{ display: 'inline' }} color={color} fontWeight={500} paddingRight={1}>
            Native Title:
          </Typography>
          <Typography sx={{ display: 'inline' }} color={color}>
            {original_title}
          </Typography>
        </Box>
        <Box sx={{ display: 'inline', whiteSpace: 'pre-line', width: '80%' }}>
          <Typography sx={{ display: 'inline' }} color={color} fontWeight={500} paddingRight={1}>
            Also Known As:
          </Typography>
          <Titles id={id} mediaType={mediaType} />
        </Box>
        <Credits id={id} mediaType={mediaType} view="creator" />
        <Box sx={{ display: 'inline', whiteSpace: 'pre-line' }}>
          <Typography sx={{ display: 'inline' }} color={color} fontWeight={500} paddingRight={1}>
            Genres:
          </Typography>
          <Genres genres={genres} />
        </Box>
        <Box sx={{ display: 'inline', width: { xs: '100%', sm: '80%' } }}>
          <Typography
            sx={{ display: 'inline', whiteSpace: 'pre-line' }}
            color={color}
            fontWeight={500}
            paddingRight={1}
          >
            Tags:
          </Typography>
          <Tags id={id} mediaType={mediaType} />
        </Box>
      </Grid>
    </Grid>
  );
};

export default DetailsTabPanel;