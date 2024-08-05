'use server';

import React from 'react';
import { Typography } from '@mui/material';
import { getTitles } from '@/server/tmdbActions';
import MediaType from '@/types/tmdb/IMediaType';
import { color } from '@/libs/common';

interface TitleProps {
  id: number;
  mediaType: MediaType.movie | MediaType.tv;
  exclude?: string[];
}
const Titles: React.FC<TitleProps> = async ({ id, mediaType, exclude = ['US'] }) => {
  const titles = await getTitles(mediaType, id);
  return (
    <Typography sx={{ color: color }}>
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
