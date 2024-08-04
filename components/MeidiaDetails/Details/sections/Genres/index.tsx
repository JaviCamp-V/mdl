import { color } from '@/libs/common';
import routes from '@/libs/routes';
import Genre from '@/types/tmdb/IGenre';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { capitalCase } from 'change-case';
import Link from 'next/link';
import React from 'react';

type GenresProps = {
  genres: Genre[];
};
const Genres: React.FC<GenresProps> = ({ genres }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
      <Typography color={color} fontWeight={500} paddingRight={1}>
        Genres:
      </Typography>
      {genres.map((genre, index, arr) => (
        <React.Fragment key={genre.id}>
          <Link key={genre.id} href={`${routes.search}?genre=${genre.id}`} style={{ textDecoration: 'none' }}>
            <Typography color="primary">{capitalCase(genre.name)}</Typography>
          </Link>
          {index < arr.length - 1 && (
            <Typography color={color} marginRight={1}>
              ,
            </Typography>
          )}
        </React.Fragment>
      ))}
    </Box>
  );
};

export default Genres;
