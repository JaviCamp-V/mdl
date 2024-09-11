import React from 'react';
import { getWatchlist } from '@/features/watchlist/service/watchlistViewService';
import WatchlistItems from '@/features/watchlist/types/interfaces/WatchlistItem';
import { capitalCase } from 'change-case';
import { parseISO } from 'date-fns';
import { Box, SxProps, Typography } from '@mui/material';
import MediaTitle from '@/components/MediaTitle';
import DramaPoster from '@/components/Poster';
import MediaType from '@/types/enums/IMediaType';
import WatchStatus from '@/types/enums/WatchStatus';
import { formatShortDate } from '@/utils/formatters';
import EditWatchlistButton from '../../buttons/EditWatchlistButton';

interface WatchlistUpdatesProps {
  watchlist: WatchlistItems[];
  containerStyle?: SxProps;
}
const WatchlistUpdates: React.FC<WatchlistUpdatesProps> = async ({ watchlist, containerStyle }) => {
  const loggedInUserWatchlist = await getWatchlist();
  const sortedWatchlist = watchlist
    .map((item) => ({
      ...item,
      recordId:
        loggedInUserWatchlist.find(
          (watchlistItem) => watchlistItem.mediaId == item.mediaId && watchlistItem.mediaType == item.mediaType
        )?.id ?? null,
      mediaType: item.mediaType.toLowerCase() as MediaType.tv | MediaType.movie,
      updatedAt: parseISO(item.updatedAt)
    }))
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  return (
    <Box sx={{ ...containerStyle, paddingX: 0, paddingY: 2, minHeight: 0 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 1,
          paddingX: 2
        }}
      >
        <Typography fontSize={18} fontWeight={700}>
          List Updates
        </Typography>
      </Box>
      <Box sx={{ marginTop: 2 }}>
        {sortedWatchlist.slice(0, 10).map((result, index, arr) => (
          <Box
            key={result.id}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 2,
              marginBottom: 1,
              paddingX: 2,
              paddingY: 1,
              ...(index !== arr.length - 1 && {
                borderBottom: '1px solid hsla(210, 8%, 51%, .13)'
              })
            }}
          >
            <Box sx={{ width: 50, height: 60 }}>
              <DramaPoster src={result.posterPath} id={result.id} mediaType={result.mediaType} size="w185" />
            </Box>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 0.5, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <MediaTitle title={result.title} id={result.id} mediaType={result.mediaType} fontSize={'14px'} />
                <EditWatchlistButton type={result.mediaType} id={result.id} recordId={result.recordId} />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 0.5 }}>
                <Typography fontSize={13}>{`${capitalCase(result.watchStatus)}`}</Typography>
                {result.watchStatus === WatchStatus.CURRENTLY_WATCHING && result.mediaType === MediaType.tv && (
                  <Typography fontSize={13}>{`${result.episodeWatched ?? 0}/${result.totalEpisodes}`}</Typography>
                )}
              </Box>
              <Typography fontSize={13} sx={{ opacity: 0.6 }}>
                {formatShortDate(result.updatedAt)}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default WatchlistUpdates;
