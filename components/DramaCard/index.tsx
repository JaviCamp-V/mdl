import Box from '@mui/material/Box';
import React from 'react';
import DramaPoster from '../Poster';
import Link from 'next/link';
import { Typography } from '@mui/material';
import routes from '@/libs/routes';
import countries from '@/libs/countires';
import MediaType from '@/types/tmdb/IMediaType';
import MediaTitle from '../MediaTitle';
import { color } from '@/libs/common';

type DramaCardProps = {
  title: string;
  country: string;
  src: string | null;
  id: number;
};
const DramaCard: React.FC<DramaCardProps> = ({ title, country, src, id }) => {
  const origin =   country in countries ? countries[country as keyof typeof countries] : country
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <Box sx={{ width: 156, height: 250 }}>
        <DramaPoster src={src} id={id} mediaType={MediaType.tv} />
      </Box>
      <Box sx={{width: '80%'}}>
        <MediaTitle id={id} title={title} mediaType={MediaType.tv} fontSize={14} />
        <Typography sx={{ opacity: 0.6, color, fontSize: 14 }}>{`${origin} Drama`}</Typography>
      </Box>
    </Box>
  );
};

export default DramaCard;
