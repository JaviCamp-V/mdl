'use server';

import React from 'react';
import { getRoles } from '@/features/media/service/tmdbViewService';
import { MediaSearchResult } from '@/features/media/types/interfaces/SearchResponse';
import { camelCase, capitalCase } from 'change-case';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import RolesTable from '../../../tables/RolesTable';


interface RolesProps {
  personId: number;
}

const Roles: React.FC<RolesProps> = async ({ personId }) => {
  const roles = await getRoles(personId);
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

  return (
    <Box sx={{ marginRight: 2, marginTop: 2 }}>
      {Object.entries(data)
        .filter(([_, results]) => results?.length)
        .map(([key, results]) => (
          <Box key={key} sx={{ marginY: 2 }}>
            <Typography fontSize={'1.25rem'} fontWeight={700}>
              {capitalCase(key)}
            </Typography>

            <Box
              sx={{
                borderBottom: '1px solid hsla(210, 8%, 51%, .13)',
                marginY: 1
              }}
            />

            <RolesTable type={key} roles={results} />
          </Box>
        ))}
    </Box>
  );
};

export default Roles;