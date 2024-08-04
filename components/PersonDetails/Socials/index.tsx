import React from 'react';

import { Avatar, Box, IconButton } from '@mui/material';
import ExternalID from '@/types/tmdb/IExternalID';
import Iconify from '@/components/Icon/Iconify';

const urlMappings = {
  wikidata: 'https://www.wikidata.org/wiki/:id',
  facebook: 'https://www.facebook.com/:id',
  instagram: 'https://www.instagram.com/:id',
  twitter: 'https://twitter.com/:id'
};

const getLink = (key: string, id: string) => {
  const url = (urlMappings as any)[key];
  return url.replace(':id', id);
};

const Socials: React.FC<ExternalID> = ({ wikidata_id, facebook_id, instagram_id, twitter_id }) => {
  const socials = {
    wikidata: wikidata_id,
    facebook: facebook_id,
    instagram: instagram_id,
    twitter: twitter_id
  };
  const color = 'hsl(0deg 0% 100% / 87%)';

  return (
    <Box sx={{ display: 'fex', flexWrap: 'wrap', gap: 1 }}>
      {Object.entries(socials)
        .filter(([_, value]) => value)
        .map(([key, value]) => (
          <IconButton key={key} href={getLink(key, value)} target="_blank">
            <Avatar sx={{ backgroundColor: '#1B1C1D'}}>
              <Iconify icon={`mdi:${key}`} sx={{ wight: 50, height: 40, color }} />
            </Avatar>
          </IconButton>
        ))}
    </Box>
  );
};

export default Socials;
