import React from 'react';
import EditWatchlistButton from '@/features/watchlist/components/buttons/EditWatchlistButton';
import Box from '@mui/material/Box';
import MediaTitle from '@/components/MediaTitle';
import MediaType from '@/types/enums/IMediaType';

interface MediaTitleRecordProps {
  title: string;
  mediaType: MediaType.movie | MediaType.tv;
  mediaId: number;
  recordId: number | null;
  showEditButton?: boolean;
  fontSize?: number | string;
  fontWeight?: number | string;
  whiteSpace?: 'nowrap' | 'normal' | 'pre' | 'pre-line' | 'pre-wrap';
}
const MediaTitleRecord: React.FC<MediaTitleRecordProps> = ({
  title,
  mediaType,
  mediaId,
  recordId,
  showEditButton = true,
  fontSize = '1rem',
  fontWeight = 700,
  whiteSpace = 'pre-wrap'
}) => {
  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'row', gap: 0.5, alignItems: 'center', flexWrap: 'wrap', width: '100%' }}
    >
      <MediaTitle
        title={title}
        id={mediaId}
        mediaType={mediaType}
        fontSize={fontSize}
        whiteSpace={whiteSpace}
        fontWeight={fontWeight}
      />
      {showEditButton && <EditWatchlistButton type={mediaType} id={mediaId} recordId={recordId} />}
    </Box>
  );
};

export default MediaTitleRecord;
