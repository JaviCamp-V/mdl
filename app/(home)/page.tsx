import React from 'react';

import { Metadata, NextPage } from 'next/types';
import { Box, Grid, Typography } from '@mui/material';


import DramaCard from '@/components/DramaCard';
import { getDiscoverType } from '@/server/tmdb2Actions';
import MediaType from '@/types/tmdb/IMediaType';
import { startingThisWeek, endingThisWeek, trending } from '@/utils/tmdbQueries';
import TopAiringDramas from '@/components/Discover/TopAiring';
import TopUpcomingDramas from '@/components/Discover/TopUpcoming';
import MostPopularDramas from '@/components/Discover/MostPopular';
import dynamicImport from 'next/dynamic';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import { color } from '@/libs/common';
import Carousel from '@/components/Carousel';

// const Carousel = dynamicImport(() => import('@/components/Carousel'), {
//   loading: () => <LoadingSkeleton width="100%" height={"30vh"} />,
// });

type PageProps = {
  searchParams: any
};

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Discover, Rate, and Watch the Best Asian Dramas and Movies',
};



const Home:NextPage<PageProps> = async () => {
  const tv = MediaType.tv;
  const startingThisWeekResponse = await getDiscoverType(tv, startingThisWeek);
  const endingThisWeekResponse = await getDiscoverType(tv, endingThisWeek);
  const trendingResponse = await getDiscoverType(tv, trending);


  const data = {
    'Trending': trendingResponse.results,
    'Starting this Week': startingThisWeekResponse.results,
    'Ending this Week': endingThisWeekResponse.results  
  }


   const boxStyle = {
     backgroundColor: '#242526',
     borderRadius: 2,
     overflow: 'hidden',
     minHeight: '50vh'
   };



  return (
    <Box sx={{ padding: { xs: 0, md: 4 }, marginX: 2, marginTop: 4 }}>
      <Grid container spacing={3} sx={{ padding: { xs: 0, md: 4 } }}>
        <Grid item xs={12} md={8.5}>
          <Box sx={{ ...boxStyle, paddingTop: 2, paddingBottom: 4 }}>
            {Object.entries(data)
              .filter(([_, dramas]) => dramas?.length)
              .map(([title, dramas], index, arr) => (
                <Box paddingY={0} key={title}>
                  <Typography color={color} marginBottom={2} paddingX={2} fontSize={24} fontWeight={500}>
                    {title}
                  </Typography>
                  <Box marginX={2} sx={{ minHeight: '30vh' }}>
                    <Carousel>
                      {dramas
                        .filter((drama: any) => drama.poster_path)
                        .map((drama: any) => (
                          <DramaCard
                            key={drama.id}
                            title={(drama as any)?.name || 'N/A'}
                            country={drama?.origin_country?.join(', ') || 'N/A'}
                            src={drama.poster_path!}
                            id={drama.id}
                          />
                        ))}
                    </Carousel>
                  </Box>
                  {index !== arr.length -1 &&(<Box sx={{ borderBottom: '1px solid hsla(210, 8%, 51%, .13)' }} marginY={2} />)}
                </Box>
              ))}
          </Box>
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

export default Home
