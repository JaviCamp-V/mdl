import React from 'react';
import { capitalCase } from 'change-case';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Ratings from '@/components/common/Ratings';
import WatchlistHistory from '@/types/watchlist/IWatchlistHistory';
import { formatShortDate, formatStringDate } from '@/utils/formatters';

interface WatchRecordHistoryListProps {
  history: WatchlistHistory[];
}
const WatchRecordHistoryList: React.FC<WatchRecordHistoryListProps> = ({ history }) => {
  const columns = [
    { field: 'watchStatus', headerName: 'Watch Status', format: (value: any) => capitalCase(value) },
    { field: 'episodeWatched', headerName: 'Episodes Seen', format: (value: any) => value },
    { field: 'rating', headerName: 'Rating', format: (value: any) => value },
    { field: 'timestamp', headerName: 'Timestamp', format: (value: any) => formatShortDate(formatStringDate(value)) }
  ];
  return (
    <Box sx={{ width: '100%' }}>
      <Typography fontWeight={700} fontSize={'1.25rem'} marginBottom={1}>
        Timeline
      </Typography>
      <TableContainer sx={{ backgroundColor: 'inherit', overflowX: 'hidden' }}>
        <Table
          sx={{
            borderLeft: 'none',
            borderRight: 'none',
            borderColor: 'hsla(210, 8%, 51%, .13)',
            tableLayout: 'fixed',
            width: '100%',
            overflowX: 'none'
          }}
        >
          <TableHead>
            <TableRow
              sx={{
                borderTop: '2px solid hsla(210, 8%, 51%, .13)!important',
                borderBottom: '3px solid hsla(210, 8%, 51%, .13)!important'
              }}
            >
              {columns.map((column) => (
                <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', whiteSpace: 'normal', wordWrap: 'break-word' }}>
                  {column.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell sx={{ fontSize: '14px' }}>{column.format((row as any)[column.field])}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default WatchRecordHistoryList;
