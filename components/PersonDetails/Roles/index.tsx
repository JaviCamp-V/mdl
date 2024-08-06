'use server';

import React from 'react';
import { camelCase, capitalCase } from 'change-case';
import { Rating, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { getRoles } from '@/server/tmdbActions';
import MediaTitle from '@/components/MediaTitle';
import MediaType from '@/types/tmdb/IMediaType';
import { MediaSearchResult } from '@/types/tmdb/ISearchResposne';
import { formatStringDate } from '@/utils/formatters';
import { getOrigin, getTitle, getYear } from '@/utils/tmdbUtils';
import { color } from '@/libs/common';

type RolesProps = {
  id: number;
};

const getReleaseDate = (role: MediaSearchResult) => {
  const date = role.media_type === MediaType.movie ? role.release_date : role.first_air_date;
  return formatStringDate(date);
};

const getRole = (role: MediaSearchResult) => {
  const type = (role as any)?.order < 5 ? 'Main Role' : 'Support Role';
  const character = (role as any).character || 'Unknown';
  return `${character} (${type})`;
};

const getType = (role: MediaSearchResult) => {
  return role.media_type === 'tv' ? 'Drama' : 'Movie';
};
const Roles: React.FC<RolesProps> = async ({ id }) => {
  const roles = await getRoles(id);
  if (roles.cast.length === 0 && roles.crew.length === 0) return <div>No roles found</div>;
  const drama = roles.cast.filter((role) => role.media_type === 'tv');
  const movies = roles.cast.filter((role) => role.media_type === 'movie');
  const groupByJob = roles.crew?.reduce(
    (acc, role: any) => {
      const job = camelCase(role.job);
      const list = job in acc ? acc[job] : [];
      return { ...acc, [job]: [...list, role] };
    },
    {} as { [key: string]: MediaSearchResult[] }
  );
  const data = {
    drama,
    movies,
    ...groupByJob
  };

  const cellStyle = {
    color: color,
    border: 'none',
    fontSize: '14px',
    WebkitFontSmoothing: 'antialiased'
  };

  const mobileStyle = {
    display: { xs: 'none', md: 'table-cell' }
  };
  return (
    <Box sx={{ marginRight: 2, marginTop: 2 }}>
      {Object.entries(data)
        .filter(([_, results]) => results?.length)
        .map(([key, results]) => (
          <Box key={key} sx={{ marginY: 2 }}>
            <Typography fontSize={'1.25rem'} fontWeight={500}>
              {capitalCase(key)}
            </Typography>

            <Box
              sx={{
                borderBottom: '1px solid hsla(210, 8%, 51%, .13)',
                marginY: 1
              }}
            />

            <TableContainer sx={{ backgroundColor: 'inherit' }}>
              <Table
                sx={{
                  borderLeft: 'none',
                  borderRight: 'none',
                  borderColor: 'hsla(210, 8%, 51%, .13)'
                }}
              >
                <TableHead>
                  <TableRow
                    sx={{
                      borderBottom: '3px solid hsla(210, 8%, 51%, .13)!important'
                    }}
                  >
                    <TableCell sx={{ ...cellStyle, fontWeight: 500, ...mobileStyle }}>Year</TableCell>
                    <TableCell sx={{ ...cellStyle, fontWeight: 500 }}>Title</TableCell>
                    {key === 'drama' && (
                      <TableCell sx={{ ...cellStyle, fontWeight: 500, ...mobileStyle }}> # </TableCell>
                    )}
                    <TableCell sx={{ ...cellStyle, fontWeight: 500, ...mobileStyle }}>
                      {['drama', 'movies'].includes(key) ? 'Role' : 'Type'}
                    </TableCell>
                    <TableCell
                      sx={{
                        ...cellStyle,
                        fontWeight: 500,
                        textAlign: 'center'
                      }}
                    >
                      Rating
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results
                    .sort((a, b) => getReleaseDate(b).getTime() - getReleaseDate(a).getTime())
                    .map((role, index, arr) => (
                      <TableRow
                        key={role.id}
                        sx={{
                          borderBottom: index !== arr.length - 1 ? '1px solid hsla(210, 8%, 51%, .13)' : 'none'
                        }}
                      >
                        <TableCell sx={{ ...cellStyle, ...mobileStyle }}>{getYear(role)}</TableCell>
                        <TableCell sx={{ ...cellStyle }}>
                          <MediaTitle title={getTitle(role)} id={role.id} mediaType={role.media_type} fontSize={14} />
                          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                            <Typography sx={{ opacity: 0.6 }}>{`${getOrigin(role)}, ${getYear(role)}${
                              role.media_type === 'tv' ? `, ${role.episode_count} eps` : ''
                            }`}</Typography>
                            {['drama', 'movies'].includes(key) && (
                              <Typography sx={{ opacity: 0.6 }}>{getRole(role)}</Typography>
                            )}
                          </Box>
                        </TableCell>
                        {role.media_type === 'tv' && key === 'drama' && (
                          <TableCell sx={{ ...cellStyle, ...mobileStyle }}>
                            <Typography>{role.episode_count}</Typography>
                          </TableCell>
                        )}
                        <TableCell sx={{ ...cellStyle, ...mobileStyle }}>
                          <Typography>{['drama', 'movies'].includes(key) ? getRole(role) : getType(role)}</Typography>
                        </TableCell>
                        <TableCell
                          sx={{
                            ...cellStyle,
                            textAlign: 'center'
                          }}
                        >
                          <Rating name="read-only" value={role.vote_average / 2} precision={0.1} readOnly />
                          <Typography fontSize={13}> {role.vote_average.toFixed(1)}</Typography>
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
};

export default Roles;
