import { color } from '@/libs/common';
import { getTitles } from '@/server/tmdb2Actions';
import MediaType from '@/types/tmdb/IMediaType';
import { Typography } from '@mui/material';
import React from 'react';

interface TitleProps {
  id: number;
  mediaType: MediaType.movie | MediaType.tv;
  exclude?: string[];
}
const Titles: React.FC<TitleProps> = async ({ id, mediaType, exclude= ['US'] }) => {
  const titles = await getTitles(mediaType, id);
  return (
    <Typography sx={{ color: color}}>
      <Typography component="span" fontWeight={500} paddingRight={1}>
        Also Known As:
      </Typography>
      {titles
        ?.filter(({ iso_3166_1 }) => !exclude.includes(iso_3166_1))
        ?.slice(0, 4)
        ?.map(({ title }) => title)
        ?.join(', ') || 'N/A'}
    </Typography>
  );
};

export default Titles;
