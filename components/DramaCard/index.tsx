import React from 'react';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import MediaType from '@/types/tmdb/IMediaType';
import { color } from '@/libs/common';
import countries from '@/libs/countries';
import MediaTitle from '../MediaTitle';
import DramaPoster from '../Poster';

type DramaCardProps = {
  title: string;
  country: string;
  src: string | null;
  id: number;
};
const DramaCard: React.FC<DramaCardProps> = ({ title, country, src, id }) => {
  const origin = countries.find((c) => c.code === country)?.nationality;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <Box sx={{ width: 156, height: 250 }}>
        <DramaPoster src={src} id={id} mediaType={MediaType.tv} />
      </Box>
      <Box sx={{ width: '80%' }}>
        <MediaTitle id={id} title={title} mediaType={MediaType.tv} fontSize={14} />
        <Typography sx={{ opacity: 0.6, color, fontSize: 14 }}>{`${origin} Drama`}</Typography>
      </Box>
    </Box>
  );
};

export default DramaCard;
