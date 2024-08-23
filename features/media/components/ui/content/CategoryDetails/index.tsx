'use server';

import React from 'react';
import MultiLinkText from '@/features/media/components/typography/MultiLinkText';
import { getTags } from '@/features/media/service/tmdbService';
import Genre from '@/features/media/types/interfaces/Genre';
import { capitalCase } from 'change-case';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MediaDetailsProps from '@/types/common/MediaDetailsProps';
import routes from '@/libs/routes';

interface ContentCategoryDetailProps extends MediaDetailsProps {
  genres: Genre[];
}
const ContentCategoryDetail: React.FC<ContentCategoryDetailProps> = async ({ mediaId, mediaType, genres }) => {
  const tags = await getTags(mediaType, mediaId);

  const tagLinks = tags?.map((tag) => ({ label: tag.name, href: `${routes.search}?keywords=${tag.id}` }));
  const genreLinks = genres?.map((genre) => ({ label: genre.name, href: `${routes.search}?genre=${genre.id}` }));
  const categories = { genres: genreLinks, tags: tagLinks };

  return (
    <Box>
      {Object.entries(categories).map(([key, links]) => (
        <Box key={key} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          <Typography fontWeight={700} paddingRight={1} fontSize={14}>
            {capitalCase(key)}:
          </Typography>
          <MultiLinkText links={links} />
        </Box>
      ))}
    </Box>
  );
};

export default ContentCategoryDetail;
