import React from 'react';
import { getTitles } from '@/features/media/service/tmdbViewService';
import { capitalCase } from 'change-case';
import Typography from '@mui/material/Typography';
import MediaDetailsProps from '@/types/common/MediaDetailsProps';

interface ContentTitlesProps extends MediaDetailsProps {
  original_title: string | null;
}
const ContentTitles: React.FC<ContentTitlesProps> = async ({ mediaId, mediaType, original_title }) => {
  const otherTitles = await getTitles(mediaType, mediaId);

  const titles = {
    nativeTitle: original_title,
    alsoKnownAs: otherTitles
      ?.filter(({ iso_3166_1 }) => iso_3166_1 !== 'US')
      ?.slice(0, 4)
      ?.map(({ title }) => title)
      ?.join(', ')
  };

  return (
    <React.Fragment>
      {Object.entries(titles).map(([key, value]) => (
        <Typography fontSize={14} key={key}>
          <Typography component="span" fontWeight={700} paddingRight={0.5} fontSize={14}>
            {capitalCase(key)}:
          </Typography>
          {value || 'N/A'}
        </Typography>
      ))}
    </React.Fragment>
  );
};

export default ContentTitles;
