import React from 'react';
import Link from 'next/link';
import { capitalCase } from 'change-case';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Iconify from '@/components/Icon/Iconify';
import UserSummary from '@/types/common/UserSummary';
import MediaType from '@/types/enums/IMediaType';
import WatchStatus from '@/types/enums/WatchStatus';
import { userRoutes } from '@/libs/routes';

interface OverallReviewWatchStatusProps {
  mediaType: MediaType.tv | MediaType.movie;
  reviewId: number;
  totalEpisodes?: number;
  username: string;
  commentCount: number;
  watchStatus: WatchStatus | null;
  episodeWatched: number | null;
  hasCompleted: boolean;
}

const chipColor = {
  [WatchStatus.COMPLETED]: 'success',
  [WatchStatus.DROPPED]: 'error',
  [WatchStatus.ON_HOLD]: 'warning',
  [WatchStatus.PLAN_TO_WATCH]: 'primary',
  [WatchStatus.CURRENTLY_WATCHING]: 'primary'
};
const OverallReviewWatchStatus: React.FC<OverallReviewWatchStatusProps> = ({
  mediaType,
  reviewId: id,
  totalEpisodes,
  username,
  commentCount,
  watchStatus,
  episodeWatched,
  hasCompleted
}) => {
  const defaultWatchStatus = hasCompleted ? WatchStatus.COMPLETED : 'Not Recorded';
  const defaultChipColor = hasCompleted ? 'success' : 'error';
  return (
    <React.Fragment>
      {mediaType.toLowerCase() === 'tv' && (
        <Typography
          fontSize={12}
          fontWeight={'bolder'}
          sx={{ opacity: 0.6, display: { xs: 'none', md: 'flex' }, gap: 0.5 }}
        >
          <Typography fontSize={12} component={'span'} sx={{ fontWeight: 700 }}>
            {episodeWatched ?? 0}
          </Typography>
          {'of'}
          <Typography fontSize={12} component={'span'} sx={{ fontWeight: 700 }}>
            {totalEpisodes ?? 0}
          </Typography>
          {'episodes watched'}
        </Typography>
      )}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 1, alignItems: 'center' }}>
        <Chip
          label={capitalCase(watchStatus ?? defaultWatchStatus)}
          variant="outlined"
          color={watchStatus ? (chipColor[watchStatus] as any) : defaultChipColor}
          sx={{ height: 'min-content', padding: 0.2, fontSize: 12 }}
        />
        <Link
          href={`${userRoutes.profile.replace('{username}', username)}/reviews/${id}`}
          style={{ textDecoration: 'none' }}
          passHref
          prefetch
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 0.5,
              alignItems: 'center',
              justifyContent: 'flex-end',
              color: 'text.primary'
            }}
          >
            <Iconify icon="fa6-regular:comments" width={14} height={14} />
            <Typography fontSize={12} sx={{ opacity: 0.6 }}>
              {commentCount ?? 0}
            </Typography>
          </Box>
        </Link>
      </Box>
    </React.Fragment>
  );
};

export default OverallReviewWatchStatus;
