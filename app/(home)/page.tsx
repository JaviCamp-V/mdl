import React from 'react';
import { Metadata, NextPage } from 'next/types';
import MostPopularDramas from '@/features/media/components/lists/MostPopular';
import TopAiringDramas from '@/features/media/components/lists/TopAiring';
import TopUpcomingDramas from '@/features/media/components/lists/TopUpcoming';
import DramaUpdates from '@/features/media/components/ui/discover/DramaUpdates';
import Box from '@mui/material/Box';

type PageProps = {
  searchParams: any;
};

export const revalidate = 1800; // 30 minutes

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
        paddingY: { xs: 0.5, sm: 2, md: 2 },
        paddingX: { xs: 0.5, sm: 2, md: 4 },
        marginX: { xs: 0.5, sm: 2, lg: 8 },
        marginTop: { xs: 1, md: 2 },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
      }}
    >
      <Box
        sx={{
          width: '100%',
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
