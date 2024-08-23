import React from 'react';
import { MediaSearchResult } from '@/features/media/types/interfaces/SearchResponse';
import { getOrigin, getTitle, getYear } from '@/features/media/utils/tmdbUtils';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import MediaTitle from '@/components/MediaTitle';
import Ratings from '@/components/common/Ratings';
import MediaType from '@/types/enums/IMediaType';
import { formatStringDate } from '@/utils/formatters';

interface RolesTableProps {
  type: string; //drama or movies or crew
  roles: MediaSearchResult[];
}

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

const RolesTable: React.FC<RolesTableProps> = ({ type, roles }) => {
  const cellStyle = {
    color: 'color.text',
    border: 'none',
    fontSize: '14px!important',
    WebkitFontSmoothing: 'antialiased'
  };

  const mobileStyle = {
    display: { xs: 'none', md: 'table-cell' }
  };
  return (
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
            {type === 'drama' && <TableCell sx={{ ...cellStyle, fontWeight: 500, ...mobileStyle }}> # </TableCell>}
            <TableCell sx={{ ...cellStyle, fontWeight: 500, ...mobileStyle }}>
              {['drama', 'movies'].includes(type) ? 'Role' : 'Type'}
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
          {roles
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
                    <Typography fontSize={13} sx={{ opacity: 0.6 }}>{`${getOrigin(role)}, ${getYear(role)}${
                      role.media_type === 'tv' ? `, ${role.episode_count} eps` : ''
                    }`}</Typography>
                    {['drama', 'movies'].includes(type) && (
                      <Typography sx={{ opacity: 0.6 }} fontSize={13}>
                        {getRole(role)}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                {role.media_type === 'tv' && type === 'drama' && (
                  <TableCell sx={{ ...cellStyle, ...mobileStyle }}>
                    <Typography fontSize={14}>{role.episode_count}</Typography>
                  </TableCell>
                )}
                <TableCell sx={{ ...cellStyle, ...mobileStyle }}>
                  <Typography fontSize={14}>
                    {['drama', 'movies'].includes(type) ? getRole(role) : getType(role)}
                  </Typography>
                </TableCell>
                <TableCell
                  sx={{
                    ...cellStyle,
                    textAlign: 'center'
                  }}
                >
                  <Ratings rating={role.vote_average} />
                  <Typography fontSize={13}> {role.vote_average.toFixed(1)}</Typography>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RolesTable;
