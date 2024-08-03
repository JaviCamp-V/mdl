import { getRoles } from '@/server/tmdb2Actions';
import MediaType from '@/types/tmdb/IMediaType';
import { formatStringDate } from '@/utils/formatters';
import { Paper, Rating, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { capitalCase } from 'change-case';
import React from 'react'

type RolesProps = {
    id: number;
}
const Roles: React.FC<RolesProps> = async({id}) => {
    const roles = await getRoles(id);
//    if (roles.cast.length === 0 && roles.crew.length === 0) return <div>No roles found</div>;
    const drama = roles.cast.filter((role) => role.media_type === 'tv');
    const movies = roles.cast.filter((role) => role.media_type === 'movie');

    const data = {
      drama,
      movies
    };
  return (
    <Box>
      {Object.entries(data).map(([key, results]) => (
        <Box key={key}>
          <Typography>{capitalCase(key)}</Typography>

          <Box sx={{ borderBottom: '1px solid hsla(210, 8%, 51%, .13)', marginY: 1 }} />

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Year</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Rating</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>
                      {formatStringDate(
                        role.media_type === MediaType.movie ? role.release_date : role?.first_air_date
                      ).getFullYear()}
                    </TableCell>
                    <TableCell>{role.media_type === MediaType.movie ? role.title : role?.name}</TableCell>
                    <TableCell>{(role as any).character}</TableCell>
                    <TableCell>
                      <Rating name="read-only" value={role.vote_average / 2} precision={0.1} readOnly />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}
    </Box>
  );
}

export default Roles