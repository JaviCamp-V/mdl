import React from 'react';

import Link from 'next/link';
import Box from '@mui/material/Box';
import { capitalCase } from 'change-case';
import {
  Rating,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';

import countriesConfig from '@/libs/countriesConfig';
import { getRoles } from '@/server/tmdb2Actions';
import MediaType from '@/types/tmdb/IMediaType';
import { MediaSearchResult } from '@/types/tmdb/ISearchResposne';
import { formatStringDate } from '@/utils/formatters';

type RolesProps = {
  id: number;
};

const getTitle = (role: MediaSearchResult) => {
  return role.media_type === MediaType.movie ? role.title : role.name;
};

const getYear = (role: MediaSearchResult) => {
  const date = role.media_type === MediaType.movie ? role.release_date : role.first_air_date;
  return date ? formatStringDate(date).getFullYear() : 'TBA';
};
const getReleaseDate = (role: MediaSearchResult) => {
  const date = role.media_type === MediaType.movie ? role.release_date : role.first_air_date;
  return formatStringDate(date);
};

const getOrigin = (role: MediaSearchResult) => {
  const { media_type } = role;
  if (media_type === MediaType.movie) return capitalCase(media_type);
  const { origin_country } = role;
  if (!origin_country.length) return 'Drama';
  const nationality =
    countriesConfig.find((country) => country.code === origin_country[0])?.nationality ?? origin_country[0];
  return capitalCase(`${nationality} Drama`);
};

// TODO crew roles
const Roles: React.FC<RolesProps> = async ({ id }) => {
  const roles = await getRoles(id);
  if (roles.cast.length === 0 && roles.crew.length === 0) return <div>No roles found</div>;
  const drama = roles.cast.filter((role) => role.media_type === 'tv');
  const movies = roles.cast.filter((role) => role.media_type === 'movie');


  const data = {
    drama,
    movies
  };

  const cellStyle = {
    color: 'hsl(0deg 0% 100% / 87%)',
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
          <Box key={key} sx={{ marginY: 1 }}>
            <Typography fontSize={'1.25rem'} fontWeight={500}>
              {capitalCase(key)}
            </Typography>

            <Box sx={{ borderBottom: '1px solid hsla(210, 8%, 51%, .13)', marginY: 1 }} />

            <TableContainer sx={{ backgroundColor: 'inherit' }}>
              <Table sx={{ borderLeft: 'none', borderRight: 'none', borderColor: 'hsla(210, 8%, 51%, .13)' }}>
                <TableHead>
                  <TableRow sx={{ borderBottom: '3px solid hsla(210, 8%, 51%, .13)!important' }}>
                    <TableCell sx={{ ...cellStyle, fontWeight: 500, ...mobileStyle }}>Year</TableCell>
                    <TableCell sx={{ ...cellStyle, fontWeight: 500 }}>Title</TableCell>
                    {key === 'drama' && (
                      <TableCell sx={{ ...cellStyle, fontWeight: 500, ...mobileStyle }}> # </TableCell>
                    )}
                    <TableCell sx={{ ...cellStyle, fontWeight: 500, ...mobileStyle }}>Role</TableCell>
                    <TableCell sx={{ ...cellStyle, fontWeight: 500 }}>Rating</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results
                    .sort((a, b) => getReleaseDate(b).getTime() - getReleaseDate(a).getTime())
                    .map((role) => (
                      <TableRow key={role.id} sx={{ borderBottom: '1px solid hsla(210, 8%, 51%, .13)' }}>
                        <TableCell sx={{ ...cellStyle, ...mobileStyle }}>{getYear(role)}</TableCell>
                        <TableCell sx={{ ...cellStyle }}>
                          <Link href={`/${role.media_type}/${role.id}`} style={{ textDecoration: 'none' }}>
                            <Typography color="primary" fontWeight={500}>
                              {getTitle(role)}
                            </Typography>
                          </Link>
                          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                            <Typography sx={{ opacity: 0.6 }}>{`${getOrigin(role)}, ${getYear(role)}${
                              role.media_type === 'tv' ? `, ${role.episode_count} eps` : ''
                            }`}</Typography>
                            <Typography sx={{ opacity: 0.6 }}>
                              {' '}
                              {`${(role as any).character || 'Unknown'} (${
                                (role as any).order < 5 ? 'Main Role' : 'Support Role'
                              })`}
                            </Typography>
                          </Box>
                        </TableCell>
                        {role.media_type === 'tv' && (
                          <TableCell sx={{ ...cellStyle, ...mobileStyle }}>
                            <Typography>{role.episode_count}</Typography>
                          </TableCell>
                        )}
                        <TableCell sx={{ ...cellStyle, ...mobileStyle }}>
                          <Typography>
                            {`${(role as any).character || 'Unknown'} (${
                              (role as any).order < 5 ? 'Main Role' : 'Support Role'
                            })`}
                          </Typography>
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
