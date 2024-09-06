'use server';

import React from 'react';
import { getUserSummary } from '@/features/profile/service/userProfileService';
import {
  getMediaOverallReviews,
  getReviewHelpful,
  getUserReviewHelpfulRating
} from '@/features/reviews/services/reviewService';
import { ExtendOverallReview } from '@/features/reviews/types/interfaces/ExtendReviewResponse';
import { getUserWatchRecord } from '@/features/watchlist/service/watchlistService';
import MediaDetailsProps from '@/types/common/MediaDetailsProps';
import WriteReviewForm from '../../forms/WriteReview';
import AllReviews from '../AllReviews';
import ReviewOverview from '../ReviewOverview';

interface ReviewDetailsProps extends MediaDetailsProps {
  section?: string | string[];
  totalEpisodes?: number;
}
const ReviewDetails: React.FC<ReviewDetailsProps> = async ({ section, mediaId, mediaType, totalEpisodes }) => {
  if (typeof section === 'object' && section.length && section[0] === 'new')
    return <WriteReviewForm mediaId={mediaId} mediaType={mediaType} />;

  const reviews = await getMediaOverallReviews(mediaType, mediaId);
  const extendedReviews: ExtendOverallReview[] = await Promise.all(
    reviews.map(async (review) => {
      const helpfulData = await getReviewHelpful(review.id);
      const helpfulRating = await getUserReviewHelpfulRating(review.id);
      const user = await getUserSummary(review.userId);
      const watchRecord = await getUserWatchRecord(user.username, mediaType, mediaId);
      return {
        ...review,
        user,
        helpful: { ...helpfulData, isHelpful: helpfulRating?.helpful },
        watchStatus: watchRecord?.watchStatus ?? null,
        episodeWatched: watchRecord?.episodeWatched ?? null
      };
    })
  );
  const sorted = extendedReviews.sort((a, b) => b.helpful.numberOfHelpfulReviews - a.helpful.numberOfHelpfulReviews);

  if (section === 'overview')
    return (
      <ReviewOverview
        reviews={sorted.slice(0, 2)}
        mediaId={mediaId}
        mediaType={mediaType}
        totalEpisodes={totalEpisodes}
      />
    );

  return <AllReviews reviews={sorted} mediaId={mediaId} mediaType={mediaType} totalEpisodes={totalEpisodes} />;
};

export default ReviewDetails;