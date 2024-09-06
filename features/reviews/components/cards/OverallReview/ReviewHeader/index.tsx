import React from 'react';
import { capitalCase } from 'change-case';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Iconify from '@/components/Icon/Iconify';
import Avatar from '@/components/common/Avatar';
import Link from '@/components/common/Link';
import UserSummary from '@/types/common/UserSummary';
import MediaType from '@/types/enums/IMediaType';
import WatchStatus from '@/types/enums/WatchStatus';
import { formatDateToDistance } from '@/utils/formatters';
import routes from '@/libs/routes';

interface ReviewHeaderProps {
  mediaType: MediaType.tv | MediaType.movie;
  reviewId: number;
  numberOfHelpfulReviews: number;
  createdAt: string;
  isHelpful: boolean | null | undefined;
  totalEpisodes?: number;
  user: UserSummary;
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
const ReviewHeader: React.FC<ReviewHeaderProps> = ({
  mediaType,
  reviewId: id,
  numberOfHelpfulReviews,
  createdAt,
  isHelpful,
  totalEpisodes,
  user,
  commentCount,
  watchStatus,
  episodeWatched,
  hasCompleted
}) => {
  const defaultWatchStatus = hasCompleted ? WatchStatus.COMPLETED : 'Not Recorded';
  const defaultChipColor = hasCompleted ? 'success' : 'error';
  return (
    <Box
      sx={{
        paddingX: { xs: 1, md: 2 },
        paddingY: 1.5,
        backgroundColor: 'background.default',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <Box
        sx={{ display: 'flex', flexDirection: 'row', gap: 0.2, justifyContent: 'flex-start', alignItems: 'center' }}
        id={`review-${id}`}
      >
        <Avatar
          sx={{ width: 50, height: 50, fontsize: 30, fontWeight: 700 }}
          src={user.avatarUrl!}
          username={user.username}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, marginLeft: 1 }}>
          <Link
            href={routes.user.profile?.replace('{username}', user.username)}
            sx={{ fontSize: 14, fontWeight: 'bolder' }}
          >
            {user.displayName}
          </Link>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 0.5, alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography fontSize={13}>
              <Typography fontSize={13} component={'span'} sx={{ fontWeight: 700 }}>
                {numberOfHelpfulReviews ?? 0}
              </Typography>
              {' people found this review helpful'}
            </Typography>
            {(isHelpful !== null && isHelpful !== undefined) && (
              <Iconify
                icon={`mdi:${isHelpful ? 'check' : 'close'}-circle-outline`}
                color={isHelpful ? 'success' : 'error'}
                width={16}
                height={16}
                sx={{ color: isHelpful ? '#287D3C' : '#B00020', display: { xs: 'none', md: 'flex' } }}
              />
            )}
          </Box>
          <Link
            href={`${routes.user.profile?.replace('{username}', user.username)}/reviews`}
            sx={{ fontSize: 13, fontWeight: 'bolder' }}
          >
            Other reviews by this user
          </Link>
        </Box>
      </Box>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', gap: 0.2 }}
      >
        <Typography fontSize={12} fontWeight={'bolder'} sx={{ opacity: 0.6, display: { xs: 'none', md: 'flex' } }}>
          {formatDateToDistance(createdAt)}
        </Typography>
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
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 1 }}>
          <Chip
            label={capitalCase(watchStatus ?? defaultWatchStatus)}
            variant="outlined"
            color={watchStatus ? (chipColor[watchStatus] as any) : defaultChipColor}
            sx={{ height: 'min-content', padding: 0.2, fontSize: 12 }}
          />
          <Box
            sx={{ display: 'flex', flexDirection: 'row', gap: 0.5, alignItems: 'center', justifyContent: 'flex-end' }}
          >
            <Iconify icon="fa6-regular:comments" color="text.main" width={14} height={14} />
            <Typography fontSize={12} sx={{ opacity: 0.6 }}>
              {commentCount}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ReviewHeader;
