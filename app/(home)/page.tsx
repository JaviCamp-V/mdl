import React from 'react';
import { Metadata, NextPage } from 'next/types';
import { Box, Grid } from '@mui/material';
import DramaUpdates from '@/components/Discover/DramaUpdates';
import MostPopularDramas from '@/components/Discover/MostPopular';
import TopAiringDramas from '@/components/Discover/TopAiring';
import TopUpcomingDramas from '@/components/Discover/TopUpcoming';
import { card_background } from '@/libs/common';

type PageProps = {
  searchParams: any;
};

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Discover, Rate and Watch the Best Asian Dramas and Movies'
};

const Home: NextPage<PageProps> = () => {
  const boxStyle = {
    backgroundColor: card_background,
    borderRadius: 2,
    overflow: 'hidden',
    minHeight: '50vh'
  };

  return (
    <Box sx={{ padding: { xs: 0, md: 4 }, marginX: 2, marginTop: 4 }}>
      <Grid container spacing={3} sx={{ padding: { xs: 0, md: 4 } }}>
        <Grid item xs={12} md={8.5}>
          <DramaUpdates containerStyle={boxStyle} />
        </Grid>
        <Grid item xs={12} md={3.5} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <TopAiringDramas containerStyle={boxStyle} />
          <TopUpcomingDramas containerStyle={boxStyle} />
          <MostPopularDramas containerStyle={boxStyle} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
