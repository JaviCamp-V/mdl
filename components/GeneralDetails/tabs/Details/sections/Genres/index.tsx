import routes from '@/libs/routes';
import Genre from '@/types/tmdb/IGenre';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import React from 'react';

type GenresProps = {
  genres: Genre[];
};
const Genres: React.FC<GenresProps> = ({ genres }) => {
  return (
    <Box sx={{ display: 'inline' }}>
      {genres.map((genre, index, arr) => (
        <React.Fragment key={genre.id}>
          <Link key={genre.id} href={`${routes.search}?genre=${genre.id}`} style={{ textDecoration: 'none' }}>
            <Typography sx={{ display: 'inline' }} color="primary" textTransform="capitalize">
              {genre.name}
            </Typography>
          </Link>
          {index < arr.length - 1 && (
            <Typography sx={{ display: 'inline', marginRight: 1 }} color="#ffF">
              ,
            </Typography>
          )}
        </React.Fragment>
      ))}
    </Box>
  );
};

export default Genres;
