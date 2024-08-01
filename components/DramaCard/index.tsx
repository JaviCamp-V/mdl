import Box from '@mui/material/Box';
import React from 'react';
import DramaPoster from '../Poster';
import Link from 'next/link';
import { Typography } from '@mui/material';
import routes from '@/libs/routes';
import countries from '@/libs/countires';

type DramaCardProps = {
  title: string;
  country: string;
  src: string;
  id: number;
};
const DramaCard: React.FC<DramaCardProps> = ({ title, country, src, id }) => {
  const origin =   country in countries ? countries[country as keyof typeof countries] : country
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <DramaPoster src={src} id={id} width={156} height={250} />
      <Link href={routes.drama.replace(':id', id.toString())} style={{ textDecoration: 'none' }}>
        <Typography sx={{ color: '#2196f3', fontWeight: 700 }}>{title}</Typography>
      </Link>
      <Typography sx={{ opacity: 0.6 }}>{`${origin} Drama`}</Typography>
    </Box>
  );
};

export default DramaCard;
