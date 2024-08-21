import React from 'react';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import MediaTitle from '@/components/MediaTitle';
import DramaPoster from '@/components/Poster';
import MediaType from '@/types/tmdb/IMediaType';
import countries from '@/libs/countries';

interface DramaCardProps {
  title: string;
  country: string;
  src: string | null;
  id: number;
}
const DramaCard: React.FC<DramaCardProps> = ({ title, country, src, id }) => {
  const origin = countries.find((c) => c.code === country)?.nationality;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <Box sx={{ width: '100%', height: { xs: '45vh', sm: '40vh' } }}>
        <DramaPoster src={src} id={id} mediaType={MediaType.tv} />
      </Box>
      <Box sx={{ width: '100%', paddingTop: 1 }}>
        <MediaTitle id={id} title={title} mediaType={MediaType.tv} fontSize={14} />
        <Typography sx={{ opacity: 0.6, fontSize: 14 }}>{`${origin} Drama`}</Typography>
      </Box>
    </Box>
  );
};

export default DramaCard;
