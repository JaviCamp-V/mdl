import React from 'react';
import MediaTitleRecord from '@/features/media/components/typography/TitleWithRecord';
import Box from '@mui/material/Box';
import Ratings from '@/components/common/Ratings';
import MediaType from '@/types/enums/IMediaType';

interface SuggestionHeaderProps {
  title: string;
  mediaId: number;
  mediaType: MediaType.tv | MediaType.movie;
  recordId: number | null;
  voteAverage: number;
}

const SuggestionCardHeader: React.FC<SuggestionHeaderProps> = ({
  title,
  mediaId,
  mediaType,
  recordId,
  voteAverage
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: { xs: 'center', md: 'space-between' },
        alignItems: { xs: 'flex-start', md: 'center' },
        gap: 0.2,
        marginBottom: 1
      }}
    >
      <MediaTitleRecord title={title} mediaType={mediaType} mediaId={mediaId} recordId={recordId} fontSize={14} />
      <Ratings rating={voteAverage} showText />
    </Box>
  );
};
export default SuggestionCardHeader;
