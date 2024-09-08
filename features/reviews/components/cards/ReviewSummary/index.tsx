import React from 'react';
import Link from 'next/link';
import { ExtendOverallReviewWithMedia } from '@/features/reviews/types/interfaces/ExtendReviewResponse';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MediaTitle from '@/components/MediaTitle';
import DramaPoster from '@/components/Poster';
import Avatar from '@/components/common/Avatar';
import Ratings from '@/components/common/Ratings';
import routes from '@/libs/routes';


interface ReviewSummaryCardProps {
  review: ExtendOverallReviewWithMedia;
}
const ReviewSummaryCard: React.FC<ReviewSummaryCardProps> = ({ review }) => {
  const { mediaId, poster_path, mediaType, title, user, id } = review;

  const overlay = (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, paddingTop: 0.2 }}>
      <Link
        href={`${routes.user.profile.replace('{username}', user.username)}/reviews/${id}`}
        style={{ textDecoration: 'none' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, paddingX: 0.5 }}>
          <Avatar
            src={user.avatarUrl ?? undefined}
            sx={{ width: 15, height: 15, fontSize: 12 }}
            username={user.username}
          />
          <Typography fontSize={14} fontWeight={'bolder'} color={'hsl(0deg 0% 100% / 87%)'}>
            {user.displayName}
          </Typography>
        </Box>
      </Link>
    </Box>
  );

  return (
    <Box
      sx={{
        width: '300'
      }}
    >
      <Box sx={{ width: '100%', height: { xs: '20vh', sm: '28vh', md: '25vh', lg: '30vh', xl: '35vh' } }}>
        <DramaPoster src={poster_path} id={`${user.username}/reviews/${id}`} mediaType={'profile'} overlay={overlay} />
      </Box>
      <Box sx={{ marginTop: 0.5, width: '100%' }}>
        <MediaTitle title={title} mediaType={mediaType.toLowerCase()} id={mediaId} fontSize={14} />
        <Box sx={{ color: 'text.main' }}>
          <Ratings rating={review.overallRating} showText />
        </Box>
      </Box>
    </Box>
  );
};

export default ReviewSummaryCard;