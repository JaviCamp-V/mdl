import React from 'react';
import { Avatar, Box, IconButton } from '@mui/material';
import Iconify from '@/components/Icon/Iconify';
import ExternalID from '@/types/tmdb/IExternalID';
import { color } from '@/libs/common';

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

const Socials: React.FC<ExternalID> = ({ facebook_id, instagram_id, twitter_id }) => {
  const socials = {
    facebook: facebook_id,
    instagram: instagram_id,
    twitter: twitter_id
  };
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0, justifyContent: 'left' }}>
      {Object.entries(socials)
        .filter(([_, value]) => value)
        .map(([key, value]) => (
          <IconButton key={key} href={getLink(key, value)} target="_blank" sx={{ margin: 0 }}>
            <Avatar
              sx={{
                backgroundColor: 'background.default',
                margin: 0,
                width: 35,
                height: 35
              }}
            >
              <Iconify icon={`mdi:${key}`} sx={{ wight: 20, height: 20, color: 'text.primary' }} />
            </Avatar>
          </IconButton>
        ))}
    </Box>
  );
};

export default Socials;
