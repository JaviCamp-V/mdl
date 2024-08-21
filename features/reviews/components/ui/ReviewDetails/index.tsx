'use server';

import React from 'react';
import { getMediaOverallReviews, getReviewHelpful } from '@/features/reviews/services/reviewService';
import { ExtendOverallReview } from '@/features/reviews/types/interfaces/ExtendReviewResponse';
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
      return { ...review, helpful: helpfulData };
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
