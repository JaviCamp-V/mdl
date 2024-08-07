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
    backgroundColor: 'background.paper',
    borderRadius: 2,
    overflow: 'hidden',
    minHeight: '50vh',
    boxShadow: '0 1px 1px rgba(0,0,0,.1)',
    border: '1px solid rgba(0, 0, 0, .14)'
  };

  return (
    <Box
      sx={{
        padding: { xs: 0, md: 4 },
        marginX: 2,
        marginTop: 4,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
      }}
    >
      <Box
        sx={{
          width: { xs: '100%', md: '100%', lg: '80%' },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'center',
          gap: 4
        }}
      >
        <Box sx={{ width: { xs: '100%', md: '65%', lg: '70%' } }}>
          <DramaUpdates containerStyle={boxStyle} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, width: { xs: '100%', md: '35%', lg: '30%' } }}>
          <TopAiringDramas containerStyle={boxStyle} />
          <TopUpcomingDramas containerStyle={boxStyle} />
          <MostPopularDramas containerStyle={boxStyle} />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
