import React from 'react';
import dynamic from 'next/dynamic';
import WatchlistItems from '@/features/watchlist/types/interfaces/WatchlistItem';
import { capitalCase } from 'change-case';
import { SxProps, Typography } from '@mui/material';
import { Box } from '@mui/system';
import BarChart from '@/components/charts/BarChart';
import RadarChar from '@/components/charts/RadarChart';
import MediaType from '@/types/enums/IMediaType';
import WatchStatus from '@/types/enums/WatchStatus';
import { formatTimeInMinutes } from '@/utils/formatters';
import { color } from '@/libs/common';

// const BarChart = dynamic(() => import('@/components/charts/BarChart'), {
//   ssr: false,
//   loading: () => <div>loading...</div>
// });

interface WatchlistStatisticsProps {
  watchlist: WatchlistItems[];
  containerStyle?: SxProps;
}

const chipColor = {
  [WatchStatus.COMPLETED]: 'success',
  [WatchStatus.DROPPED]: 'error',
  [WatchStatus.ON_HOLD]: 'warning',
  [WatchStatus.PLAN_TO_WATCH]: 'info',
  [WatchStatus.CURRENTLY_WATCHING]: 'primary'
};

const WatchlistStatistics: React.FC<WatchlistStatisticsProps> = ({ watchlist, containerStyle }) => {
  const stats = watchlist.reduce(
    (acc, item) => {
      const mediaType = item.mediaType.toLowerCase() as MediaType.tv | MediaType.movie;
      const runtime = item.runtime ?? 0;
      const episodes = item.episodeWatched ?? 1;
      const time = runtime * episodes;
      acc[mediaType].total += 1;
      acc[mediaType].time += time;
      acc[mediaType].episodes += episodes;
      return acc;
    },
    {
      [MediaType.tv]: { total: 0, time: 0, episodes: 0 },
      [MediaType.movie]: { total: 0, time: 0, episodes: 0 }
    }
  );

  const watchStatusGroup = watchlist.reduce(
    (status, item) => {
      const mediaType = item.mediaType.toLowerCase() as MediaType.tv | MediaType.movie;
      const formatType = mediaType === MediaType.tv ? 'Drama' : 'Movie';
      status[item.watchStatus][formatType] += 1;
      return status;
    },
    {
      [WatchStatus.CURRENTLY_WATCHING]: { Drama: 0, Movie: 0 },
      [WatchStatus.COMPLETED]: { Drama: 0, Movie: 0 },
      [WatchStatus.DROPPED]: { Drama: 0, Movie: 0 },
      [WatchStatus.ON_HOLD]: { Drama: 0, Movie: 0 },
      [WatchStatus.PLAN_TO_WATCH]: { Drama: 0, Movie: 0 }
    }
  );

  const getPercentage = (key: 'Drama' | 'Movie', value: number) => {
    const mediaType = key === 'Drama' ? MediaType.tv : MediaType.movie;
    const total = stats[mediaType].total;
    return ((value / total) * 100).toFixed(0);
  };

  const movieColors = { color: '#1D3549', borderColor: '#0275D8' };
  const dramaColors = { color: '#334639', borderColor: '#4F8660' };

  return (
    <Box sx={{ ...containerStyle, paddingX: 0, paddingY: 2, minHeight: '20vh' }}>
      <Box
        sx={{
          marginBottom: 1,
          paddingX: 2
        }}
      >
        <Typography fontSize={18} fontWeight={700}>
          Statistics
        </Typography>
      </Box>

      {Object.entries(stats).map(([key, value], index, arr) => (
        <Box
          key={key}
          sx={{
            backgroundColor: 'background.default',
            padding: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            borderRight: '1px solid hsla(210,8%,51%,.13)',
            borderLeft: '1px solid hsla(210,8%,51%,.13)',
            borderBottom: index === arr.length - 1 ? 'none' : '1px solid hsla(210,8%,51%,.13)'
          }}
        >
          <Typography fontSize={16} fontWeight={'bolder'}>
            {formatTimeInMinutes(value.time)}
          </Typography>
          <Typography fontSize={16} fontWeight={'bolder'}>
            All Time
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
            {key === 'tv' && <Typography fontSize={14}>{value.episodes?.toLocaleString()} episodes</Typography>}
            <Typography fontSize={14}>
              {value.total} {` ${capitalCase(key === 'tv' ? 'drama' : key)}`}
            </Typography>
          </Box>
        </Box>
      ))}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 1, marginBottom: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, padding: 1 }}>
          {Object.entries({ Drama: dramaColors, Movie: movieColors }).map(([key, value]) => (
            <Box
              key={key}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 1,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Box
                sx={{
                  border: `1.5px solid ${value.borderColor}`,
                  backgroundColor: value.color,
                  padding: 0.5,
                  display: 'inline-block'
                }}
              />
              <Typography fontSize={14} fontWeight={'bolder'}>
                {key}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box sx={{ width: '100%', height: '40vh' }}>
          <RadarChar
            data={Object.entries(watchStatusGroup).map(([key, value]) => ({
              watchStatus: capitalCase(key),
              Drama: getPercentage('Drama', value.Drama),
              Movie: getPercentage('Movie', value.Movie)
            }))}
            xAxisDataKey="watchStatus"
            margin={{ top: 0, right: 2, left: 2, bottom: 0 }}
            plots={[
              { key: 'Drama', ...dramaColors },
              { key: 'Movie', ...movieColors }
            ]}
          />
        </Box>
        <Box sx={{ width: '100%', height: '50vh' }}>
          <BarChart
            margin={{ top: 0, right: 30, left: 0, bottom: 40 }}
            width={500}
            height={200}
            data={Object.entries(watchStatusGroup).map(([key, value]) => ({ watchStatus: capitalCase(key), ...value }))}
            xAxisDataKey="watchStatus"
            plots={[
              { key: 'Drama', ...dramaColors },
              { key: 'Movie', ...movieColors }
            ]}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default WatchlistStatistics;
