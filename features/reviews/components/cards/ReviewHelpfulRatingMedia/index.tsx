import React from 'react';
import Box from '@mui/material/Box';
import DramaPoster from '@/components/Poster';
import MediaDetailsProps from '@/types/common/MediaDetailsProps';
import ReviewHelpfulRatingCard from '../ReviewHelpfulRating';

interface ReviewRatingCardProps extends MediaDetailsProps {
  poster_path: string | null;
  title: string;
  numberOfHelpfulReviews: number;
  isHelpful: boolean | null | undefined;
  username: string;
}
const ReviewHelpfulRatingMediaCard: React.FC<ReviewRatingCardProps> = ({
  title,
  mediaId,
  mediaType,
  poster_path,
  numberOfHelpfulReviews,
  isHelpful,
  username
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 0.2,
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%'
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: { xs: '30%', md: '20%' },
          height: { xs: '10vh', sm: '15vh' }
        }}
      >
        <DramaPoster src={poster_path} mediaType={mediaType} id={mediaId} size="w342" />
      </Box>
      <ReviewHelpfulRatingCard
        title={title}
        titleLink={`/${mediaType}/${mediaId}`}
        numberOfHelpfulReviews={numberOfHelpfulReviews}
        isHelpful={isHelpful}
        username={username}
      />
    </Box>
  );
};

export default ReviewHelpfulRatingMediaCard;
