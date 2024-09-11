import React from 'react';
import ReviewType from '@/features/reviews/types/enums/ReviewType';
import {
  ExtendEpisodeReviewWithMediaHelpful,
  ExtendOverallReviewWithMediaHelpful
} from '@/features/reviews/types/interfaces/ExtendReviewResponse';
import Box from '@mui/material/Box';
import AddHelpfulRatingButtons from '../../buttons/AddHelpfulRating';
import ReviewRatingCard from '../Ratings';
import ReviewBody from '../ReviewBody';
import ReviewHeader from './ReviewHeader';

interface ReviewDetailsCardProps {
  review: ExtendOverallReviewWithMediaHelpful | ExtendEpisodeReviewWithMediaHelpful;
  username: string;
}

const UserReviewCard: React.FC<ReviewDetailsCardProps> = ({ review, username }) => {
  const {
    id,
    createdAt,
    helpful: { numberOfHelpfulReviews, isHelpful },
    mediaType,
    mediaId,
    reviewType,
    commentCount,
    headline,
    content,
    overallRating,
    hasSpoilers,
    title,
    poster_path,
    number_of_episodes
  } = review;
  return (
    <Box sx={{ width: '100%' }}>
      <ReviewHeader
        mediaType={mediaType.toLowerCase() as any}
        reviewId={id}
        numberOfHelpfulReviews={numberOfHelpfulReviews}
        createdAt={createdAt}
        isHelpful={isHelpful}
        username={username}
        commentCount={commentCount}
        watchStatus={reviewType === ReviewType.OVERALL ? review?.watchStatus : null}
        episodeWatched={reviewType === ReviewType.OVERALL ? review?.episodeWatched : null}
        hasCompleted={reviewType === ReviewType.OVERALL ? review?.hasCompleted : false}
        totalEpisodes={number_of_episodes ?? 0}
        poster_path={poster_path}
        title={title}
        reviewType={reviewType}
        mediaId={mediaId}
        overallRating={overallRating}
      />
      <Box sx={{ paddingX: 2, marginTop: 2 }}>
        {reviewType === ReviewType.OVERALL && (
          <ReviewRatingCard
            storyRating={review.storyRating}
            actingRating={review.actingRating}
            musicRating={review.musicRating}
            overallRating={overallRating}
            rewatchValueRating={review.rewatchValueRating}
          />
        )}
        <ReviewBody reviewId={id} content={content} headline={headline} hasSpoilers={hasSpoilers} />

        <AddHelpfulRatingButtons reviewId={id} isHelpful={isHelpful} />
      </Box>
    </Box>
  );
};

export default UserReviewCard;
