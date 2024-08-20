'use client';

import React from 'react';
import Link from 'next/link';
import { markReviewHelpful, removedHelpfulRating } from '@/features/reviews/services/reviewService';
import ReviewType from '@/features/reviews/types/enums/ReviewType';
import { ExtendOverallReview } from '@/features/reviews/types/interfaces/ExtendReviewResponse';
import { capitalCase } from 'change-case';
import { error } from 'console';
import { enqueueSnackbar } from 'notistack';
import { Avatar, Box, Button, Chip, Typography } from '@mui/material';
import Iconify from '@/components/Icon/Iconify';
import Divider from '@/components/common/Divider';
import WatchStatus from '@/types/watchlist/WatchStatus';
import { formatDateToDistance } from '@/utils/formatters';
import { scrollToElementByID } from '@/utils/scrollToElement';
import routes from '@/libs/routes';

interface OverallReviewCardProps {
  review: ExtendOverallReview;
  totalEpisodes?: number;
}

const chipColor = {
  [WatchStatus.COMPLETED]: 'success',
  [WatchStatus.DROPPED]: 'error',
  [WatchStatus.ON_HOLD]: 'warning',
  [WatchStatus.PLAN_TO_WATCH]: 'primary',
  [WatchStatus.CURRENTLY_WATCHING]: 'primary'
};
const minContent = 4;

const OverallReviewCard: React.FC<OverallReviewCardProps> = ({ review, totalEpisodes }) => {
  const {
    user,
    id,
    watchStatus,
    episodeWatched,
    createdAt,
    helpful: { numberOfHelpfulReviews, isHelpful },
    mediaType,
    mediaId,
    reviewType,
    commentCount,
    headline,
    content,
    storyRating,
    actingRating,
    musicRating,
    overallRating,
    rewatchValueRating,
    hasSpoilers,
    hasCompleted
  } = review;
  const rating = { overallRating, storyRating, actingRating, musicRating, rewatchValueRating };

  const [isReadMore, setIsReadMore] = React.useState(false);
  const text = React.useMemo(() => {
    return isReadMore ? content : content.split('\n').slice(0, minContent).join('\n');
  }, [isReadMore, content]);

  const addHelpfulRating = async (newIsHelpful: boolean | null) => {
    if (isHelpful === newIsHelpful) {
      return;
    }
    const response =
      newIsHelpful === null
        ? await removedHelpfulRating(mediaType, mediaId, id)
        : await markReviewHelpful(mediaType, mediaId, id, newIsHelpful);
    const action = newIsHelpful === null ? 'removed' : 'marked';
    if (response && 'errors' in response) {
      const message = response.errors.map((error) => capitalCase(error.message)).join(', ');
      enqueueSnackbar(message, { variant: 'error' });
      return;
    }
    enqueueSnackbar(`Successfully ${action} helpful rating`, { variant: 'success' });
  };

  const handleReadMore = (value: boolean) => {
    setIsReadMore(value);
    scrollToElementByID(`review-${id}`);
  };
  const defaultWatchStatus = hasCompleted ? WatchStatus.COMPLETED : 'Not Recorded';
  const defaultChipColor = hasCompleted ? 'success' : 'error';

  return (
    <Box sx={{}}>
      <Box
        sx={{
          paddingX: 2,
          paddingY: 1.5,
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box
          sx={{ display: 'flex', flexDirection: 'row', gap: 1, justifyContent: 'flex-start', alignItems: 'center' }}
          id={`review-${id}`}
        >
          <Avatar sx={{ width: 50, height: 50, fontsize: 30, fontWeight: 700 }}>{user.displayName?.charAt(0)}</Avatar>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, marginLeft: 1 }}>
            <Link href={routes.user.profile?.replace('{username}', user.username)} style={{ textDecoration: 'none' }}>
              <Typography fontSize={14} fontWeight={'bolder'} color="primary">
                {user.displayName}
              </Typography>
            </Link>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 0.5, alignItems: 'center' }}>
              <Typography fontSize={13}>
                <Typography fontSize={13} component={'span'} sx={{ fontWeight: 700 }}>
                  {numberOfHelpfulReviews ?? 0}
                </Typography>
                {' people found this review helpful'}
              </Typography>
              {isHelpful !== null && (
                <Iconify
                  icon={`mdi:${isHelpful ? 'check' : 'close'}-circle-outline`}
                  color={isHelpful ? 'success' : 'error'}
                  width={16}
                  height={16}
                  sx={{ color: isHelpful ? '#287D3C' : '#B00020' }}
                />
              )}
            </Box>
            <Link
              href={`${routes.user.profile?.replace('{username}', user.username)}/reviews`}
              style={{ textDecoration: 'none' }}
            >
              <Typography fontSize={13} fontWeight={'bolder'} color="primary">
                Other reviews by this user
              </Typography>
            </Link>
          </Box>
        </Box>
        <Box
          sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', gap: 0.2 }}
        >
          <Typography fontSize={12} fontWeight={'bolder'} sx={{ opacity: 0.6 }}>
            {formatDateToDistance(createdAt)}
          </Typography>
          {mediaType.toLowerCase() === 'tv' && (
            <Typography fontSize={12} fontWeight={'bolder'} sx={{ opacity: 0.6 }}>
              <Typography fontSize={12} component={'span'} sx={{ fontWeight: 700 }}>
                {episodeWatched ?? 0}
              </Typography>
              {' of '}
              <Typography fontSize={12} component={'span'}>
                {totalEpisodes ?? 0}
              </Typography>
              {' episodes watched'}
            </Typography>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
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
      <Box sx={{ paddingX: 2, marginTop: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'background.default',
            borderRadius: '4px',
            boxShadow: '0 1px 1px rgba(0,0,0,.1)',
            border: '1px solid rgba(0,0,0,.14)',
            width: { xs: '40%', sm: '30%', md: '25%' },
            padding: 1,
            gap: 0.5,
            float: 'right',
            margin: '0 15px 15px 0'
          }}
        >
          {Object.entries(rating).map(([key, value]) => (
            <React.Fragment key={key}>
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                <Typography
                  fontSize={13}
                  fontWeight={key === 'overallRating' ? 700 : 400}
                  color={key === 'overallRating' ? 'primary' : 'text.main'}
                >
                  {capitalCase(key)}
                </Typography>
                <Typography
                  fontSize={13}
                  fontWeight={key === 'overallRating' ? 700 : 400}
                  color={key === 'overallRating' ? 'primary' : 'text.main'}
                >
                  {value.toFixed(1)}
                </Typography>
              </Box>
              {key === 'overallRating' && <Divider marginY={0.5} />}
            </React.Fragment>
          ))}
        </Box>
        <Typography fontSize={14} fontWeight="bolder" marginY={1}>
          {headline}
        </Typography>

        {hasSpoilers && (
          <Typography fontSize={14} color="error" fontWeight="bolder" marginY={1}>
            This review contains spoilers
          </Typography>
        )}

        <Typography
          fontSize={14}
          lineHeight={1.5}
          paddingBottom={1.5}
          sx={{
            whiteSpace: 'pre-wrap'
          }}
          onClick={() => !isReadMore && handleReadMore(true)}
        >
          {text}
        </Typography>
        {content.split('\n').length > minContent && (
          <Box
            sx={{
              zIndex: 101,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              backgroundImage:
                'linear-gradient(180deg,var(--mdl-gradient-1),var(--mdl-gradient-2),var(--mdl-gradient-3))',
              width: '100%',
              padding: 0
            }}
          >
            <Iconify
              icon={`ic:round-keyboard-double-arrow-${isReadMore ? 'up' : 'down'}`}
              color="text.main"
              width={16}
              height={16}
              onClick={() => handleReadMore(!isReadMore)}
              sx={{ cursor: 'pointer', pointerEvents: 'auto' }}
            />
            <Typography
              color={'primary'}
              onClick={() => handleReadMore(!isReadMore)}
              sx={{
                cursor: 'pointer',
                pointerEvents: 'auto',
                fontSize: 14,
                fontWeight: 700
              }}
            >
              {isReadMore ? 'Read less' : 'Read more'}
            </Typography>
          </Box>
        )}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 1,
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginY: 1.5
          }}
        >
          <Typography fontSize={14} sx={{ opacity: 0.6 }}>
            Was this review helpful?
          </Typography>
          <Button
            variant={isHelpful ? 'outlined' : 'contained'}
            color={isHelpful ? 'success' : 'info'}
            sx={{ padding: 0, textTransform: 'capitalize', fontSize: 12 }}
            onClick={() => addHelpfulRating(true)}
          >
            Yes
          </Button>
          <Button
            variant={isHelpful === false ? 'outlined' : 'contained'}
            color={isHelpful === false ? 'error' : 'info'}
            sx={{ padding: 0, textTransform: 'capitalize', fontSize: 12 }}
            onClick={() => addHelpfulRating(false)}
          >
            No
          </Button>
          {isHelpful !== null && (
            <Button
              variant="contained"
              color={'info'}
              sx={{ padding: 0, textTransform: 'capitalize', fontSize: 12 }}
              onClick={() => addHelpfulRating(null)}
            >
              Cancel
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default OverallReviewCard;
