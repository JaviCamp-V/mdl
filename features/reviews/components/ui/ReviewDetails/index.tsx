// Server Component
import React from 'react';
import AuthRequired from '@/features/auth/components/ui/AuthRequired';
import {
  getExtendedEpisodeReviews,
  getExtendedOverallReviews
} from '@/features/reviews/services/reviewAdvancedService';
import { getUserEpisodeReview, getUserOverallReview } from '@/features/reviews/services/reviewViewService';
import ReviewType from '@/features/reviews/types/enums/ReviewType';
import { ExtendOverallReview } from '@/features/reviews/types/interfaces/ExtendReviewResponse';
import { User } from 'next-auth';
import MediaDetailsProps from '@/types/common/MediaDetailsProps';
import { getSession } from '@/utils/authUtils';
import WriteReviewForm from '../../forms/WriteReview';
import AllReviews from '../AllReviews';
import ReviewOverview from '../ReviewOverview';

interface OverallReviewsProps extends MediaDetailsProps {
  reviewType: ReviewType.OVERALL;
  section: 'overview' | 'all' | 'new' | 'edit';
  totalEpisodes?: number;
}

interface EpisodeReviewsProps extends MediaDetailsProps {
  reviewType: ReviewType.EPISODE;
  seasonNumber: number;
  episodeNumber: number;
  section: 'new' | 'edit' | 'all';
}
type ReviewDetailsProps = OverallReviewsProps | EpisodeReviewsProps;

const WriteReview: React.FC<ReviewDetailsProps & Record<'user', User | null | undefined>> = async ({
  mediaId,
  mediaType,
  reviewType,
  section,
  user,
  ...rest
}) => {
  if (!user) return <AuthRequired action="write a review" sx={{ minHeight: '20vh' }} />;
  if (reviewType === ReviewType.OVERALL) {
    const review = section === 'edit' ? await getUserOverallReview(mediaType, mediaId) : null;
    return <WriteReviewForm mediaId={mediaId} mediaType={mediaType} reviewType={reviewType} review={review} />;
  }
  const { seasonNumber, episodeNumber } = rest as EpisodeReviewsProps;
  const review = section === 'edit' ? await getUserEpisodeReview(mediaId, seasonNumber, episodeNumber) : null;

  return (
    <WriteReviewForm
      mediaId={mediaId}
      mediaType={mediaType}
      reviewType={reviewType}
      seasonNumber={seasonNumber}
      episodeNumber={episodeNumber}
      review={review}
    />
  );
};
const ReviewDetails: React.FC<ReviewDetailsProps> = async (props) => {
  const { section, mediaId, mediaType, reviewType } = props;
  const session = await getSession();

  if (section === 'new' || section === 'edit') return <WriteReview {...props} user={session?.user} />;

  const reviews =
    reviewType === ReviewType.OVERALL
      ? await getExtendedOverallReviews(mediaType, mediaId)
      : await getExtendedEpisodeReviews(mediaId, props.seasonNumber, props.episodeNumber);

  const userReview = session?.user.userId ? reviews?.find((review) => review.user.id === session?.user.userId) : null;

  if (reviewType === ReviewType.OVERALL && section === 'overview')
    return (
      <ReviewOverview
        reviews={reviews.slice(0, 2) as ExtendOverallReview[]}
        mediaId={mediaId}
        mediaType={mediaType}
        totalEpisodes={props.totalEpisodes}
        userReviewId={userReview ? userReview.id : null}
      />
    );

  return (
    <AllReviews
      view="media"
      reviewType={reviewType}
      reviews={reviews as any}
      mediaId={mediaId}
      mediaType={mediaType}
      totalEpisodes={reviewType === ReviewType.OVERALL ? props.totalEpisodes : undefined}
      userReview={userReview as any}
      seasonNumber={reviewType === ReviewType.EPISODE ? props.seasonNumber! : 0}
      episodeNumber={reviewType === ReviewType.EPISODE ? props.episodeNumber! : 0}
    />
  );
};

export default ReviewDetails;
