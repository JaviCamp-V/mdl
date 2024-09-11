import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Iconify from '@/components/Icon/Iconify';
import Link from '@/components/common/Link';
import routes from '@/libs/routes';

interface ReviewRatingCardProps {
  title: string;
  titleLink: string;
  username: string;
  numberOfHelpfulReviews: number;
  isHelpful: boolean | null | undefined;
}

const ReviewHelpfulRatingCard: React.FC<ReviewRatingCardProps> = ({
  title,
  titleLink,
  numberOfHelpfulReviews,
  isHelpful,
  username
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, marginLeft: 1, width: '100%' }}>
      <Link href={titleLink} sx={{ fontSize: 14, fontWeight: 'bolder' }}>
        {title}
      </Link>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 0.5, alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography fontSize={13}>
          <Typography fontSize={13} component={'span'} sx={{ fontWeight: 700 }}>
            {numberOfHelpfulReviews ?? 0}
          </Typography>
          {' people found this review helpful'}
        </Typography>
        {isHelpful !== null && isHelpful !== undefined && (
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
        href={`${routes.user.profile?.replace('{username}', username)}/reviews`}
        sx={{ fontSize: 13, fontWeight: 'bolder' }}
      >
        Other reviews by this user
      </Link>
    </Box>
  );
};

export default ReviewHelpfulRatingCard;