import React from 'react';
import { capitalCase } from 'change-case';
import { Badge, Chip } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Iconify from '@/components/Icon/Iconify';
import Ratings from '@/components/common/Ratings';
import Table from '@/components/common/Table';
import WatchlistHistory from '@/types/watchlist/IWatchlistHistory';
import WatchStatus from '@/types/watchlist/WatchStatus';
import { formatDateToDistance, formatShortDate, formatStringDate } from '@/utils/formatters';

interface WatchRecordHistoryListProps {
  history: WatchlistHistory[];
}

const chipColor = {
  [WatchStatus.COMPLETED]: 'success',
  [WatchStatus.DROPPED]: 'error',
  [WatchStatus.ON_HOLD]: 'warning',
  [WatchStatus.PLAN_TO_WATCH]: 'info',
  [WatchStatus.CURRENTLY_WATCHING]: 'primary'
};

interface HistoryCardProps {
  history: WatchlistHistory;
}
const HistoryCard: React.FC<HistoryCardProps> = ({ history }) => {
  return (
    <Box
      sx={{
        borderRadius: '4px',
        border: '1px solid black',
        backgroundColor: 'info.main',
        borderColor: 'background.default',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        overflow: 'hidden',
        gap: 2,
        paddingY: 2,
        paddingX: 1
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, justifyContent: 'left' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
          <Iconify icon="mdi:movie" fontSize="1.5rem" />
          <Typography fontSize={14}>{`Episode ${history.episodeWatched}`}</Typography>
        </Box>
        <Ratings rating={history.rating} showText />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, justifyContent: 'right' }}>
        <Chip
          label={capitalCase(history.watchStatus)}
          variant="outlined"
          color={chipColor[history.watchStatus] as 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'}
          sx={{
            // backgroundColor: '#F3F5F9',
            borderRadius: 2,
            fontWeight: 700,
            height: 'min-content',
            padding: 0.2,
            fontSize: 12
          }}
        />
        <Typography fontSize={14}>{formatDateToDistance(history.timestamp)}</Typography>
      </Box>
    </Box>
  );
};
const WatchRecordHistoryList: React.FC<WatchRecordHistoryListProps> = ({ history }) => {
  //   const columns: DataColumn[] = [
  //     {
  //       field: 'watchStatus',
  //       headerName: 'Status',
  //       format: (value: any) => capitalCase(value)
  //     },
  //     // { field: 'episodeWatched', headerName: 'Watched', format: (value: any) => `${value} eps` },
  //     { field: 'rating', headerName: 'Rating', render: (values: any) => <Ratings rating={values.rating} showText /> },
  //     {
  //       field: 'timestamp',
  //       headerName: 'Timestamp',
  //       format: (value: any) => formatDateToDistance(value)
  //     }
  //   ];
  return (
    <Box sx={{ width: '100%' }}>
      <Typography fontWeight={700} fontSize={'1.25rem'} marginBottom={1}>
        Timeline
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {history.map((record, index) => (
          <HistoryCard key={record.timestamp} history={record} />
        ))}
      </Box>
      {/* <Table columns={columns} rows={history} /> */}
    </Box>
  );
};

export default WatchRecordHistoryList;
