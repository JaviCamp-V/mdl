import React from 'react';

import { Metadata, NextPage } from 'next/types';
import { Box, List, ListItem, Typography } from '@mui/material';

import { getAirings, getEndingThisWeek, getPopular, getStartingThisWeek } from '@/server/tmdbActions';

import Carousel from '@/components/Carousel';
import DramaCard from '@/components/DramaCard';

type PageProps = {
  searchParams: any
};

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Discover, Rate, and Watch the Best Asian Dramas and Movies',
};

const Home:NextPage<PageProps> = async () => {
  const current = await getAirings();
  const startingThisWeek = await getStartingThisWeek();
  const endingThisWeek = await getEndingThisWeek();
  const mostPopular = await getPopular();
  const boxStyle = {
    marginTop: 4,
    backgroundColor: '#242526',
    borderRadius: 2,
    padding: 2,
    overflow: 'hidden'
  };

  const data = {
    'Most Popular': mostPopular,
    'Top Airing': current,
    'Starting this Week': startingThisWeek,
    'Ending this Week': endingThisWeek
  }
  return (
    <Box>

      { Object.entries(data).filter(([_, dramas])=> dramas?.length).map(([title, dramas]) => (
        <Box padding={2} key={title}>
          <Typography color="primary" marginBottom={2}>
            {title}
          </Typography>
          <Carousel>
            {dramas.map((drama) => (
              <DramaCard
                key={drama.id}
                title={drama.name}
                country={drama.origin_country.join(', ')}
                src={drama.poster_path}
                id={drama.id}
              />
            ))}
          </Carousel>
        </Box>
      ))}
      <List>
        <ListItem> sidebar</ListItem>
        <ListItem> hero</ListItem>
        <ListItem> news</ListItem>
        <ListItem> recent review</ListItem>
        <ListItem> trending</ListItem>
        <ListItem> starting</ListItem>
        <ListItem>ending</ListItem>
        <ListItem> popular list</ListItem>
        <ListItem> top airing </ListItem>
        <ListItem> top upcoming</ListItem>
        <ListItem> most popular</ListItem>
      </List>
    </Box>
  );
};

export default Home
