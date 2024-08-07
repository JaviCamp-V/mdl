import React from 'react';
import Link from 'next/link';
import { capitalCase } from 'change-case';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Genre from '@/types/tmdb/IGenre';
import { color } from '@/libs/common';
import routes from '@/libs/routes';

type GenresProps = {
  genres: Genre[];
};
const Genres: React.FC<GenresProps> = ({ genres }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
      <Typography fontWeight={700} paddingRight={1} fontSize={14}>
        Genres:
      </Typography>
      {genres.length
        ? genres.map((genre, index, arr) => (
            <React.Fragment key={genre.id}>
              <Link key={genre.id} href={`${routes.search}?genre=${genre.id}`} style={{ textDecoration: 'none' }}>
                <Typography fontSize={14} color="primary">
                  {capitalCase(genre.name)}
                </Typography>
              </Link>
              {index < arr.length - 1 && <Typography sx={{ marginRight: 0.2 }}>,</Typography>}
            </React.Fragment>
          ))
        : 'N/A'}
    </Box>
  );
};

export default Genres;
