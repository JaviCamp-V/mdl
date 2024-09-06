import React from 'react';
import { getUserWatchlist } from '@/features/watchlist/service/watchlistService';
import { Grid, SxProps } from '@mui/material';
import WatchlistUpdates from '../../lists/Updates';
import WatchlistStatistics from '../WatchlistStats';

interface WatchListOverviewProps {
  containerStyle?: SxProps;
  username: string;
}
const WatchlistOverview: React.FC<WatchListOverviewProps> = async ({ username, containerStyle }) => {
  const watchlist = await getUserWatchlist(username);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <WatchlistStatistics watchlist={watchlist} containerStyle={containerStyle} />
      </Grid>
      <Grid item xs={12} md={6}>
        <WatchlistUpdates watchlist={watchlist} containerStyle={containerStyle} />
      </Grid>
    </Grid>
  );
};

export default WatchlistOverview;
