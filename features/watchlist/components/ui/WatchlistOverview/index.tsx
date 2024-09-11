import React from 'react';
import { getUserWatchlistByIdWithMedia } from '@/features/watchlist/service/watchlistAdvancedService';
import { Grid, SxProps } from '@mui/material';
import WatchlistUpdates from '../../lists/Updates';
import WatchlistStatistics from '../WatchlistStats';

interface WatchListOverviewProps {
  containerStyle?: SxProps;
  userId: number;
}
const WatchlistOverview: React.FC<WatchListOverviewProps> = async ({ userId, containerStyle }) => {
  const watchlist = await getUserWatchlistByIdWithMedia(userId);
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
