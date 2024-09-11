'use server';

import { getValidContentSummary } from '@/features/media/service/tmdbViewService';
import { getUserSummary } from '@/features/profile/service/userProfileService';
import { getUserWatchlistRecord } from '@/features/watchlist/service/watchlistViewService';
import MediaType from '@/types/enums/IMediaType';
import handleServerError from '@/utils/handleServerError';
import ReviewType from '../types/enums/ReviewType';
import { ExtendEpisodeReviewWithMediaHelpful, ExtendOverallReview, ExtendOverallReviewWithMediaAndUser, ExtendOverallReviewWithMediaHelpful, ExtendedEpisodeReview } from '../types/interfaces/ExtendReviewResponse';
import { getMediaEpisodeReviews, getMediaOverallReviews, getRecentReviews, getReview, getReviewHelpful, getUserReviewHelpfulRating, getUserReviews } from './reviewViewService';


/**
 * This is for review services that depend on  other feature services
 */

const getRecentReviewsWithMedia = async (): Promise<ExtendOverallReviewWithMediaAndUser[]> => {
  try {
    const reviews = await getRecentReviews();
    const withMedia = await Promise.all(
      reviews.map(async (review) => {
        const user = await getUserSummary(review.userId);
        const type = review.mediaType.toLowerCase() as any;
        const details = await getValidContentSummary(type, review.mediaId);
        if (!details) return { ...review, poster_path: null, title: 'Unknown', origin: 'Unknown', user: user };
        const { title, poster_path } = details;

        return { ...review, poster_path, title, origin, user: user };
      })
    );
    return withMedia;
  } catch (error: any) {
    handleServerError(error, 'getting recent reviews');
    return [];
  }
};

const getExtendedOverallReviews = async (
  mediaType: MediaType.tv | MediaType.movie,
  mediaId: number
): Promise<ExtendOverallReview[]> => {
  const reviews = await getMediaOverallReviews(mediaType, mediaId);
  const withExtended = await Promise.all(
    reviews.map(async (review) => {
      const helpfulData = await getReviewHelpful(review.id);
      const helpfulRating = await getUserReviewHelpfulRating(review.id);
      const user = await getUserSummary(review.userId);
      const withUserAndHelpful = { ...review, user, helpful: { ...helpfulData, isHelpful: helpfulRating?.helpful } };
      const watchRecord = await getUserWatchlistRecord(mediaType, mediaId, review.userId);
      return {
        ...withUserAndHelpful,
        watchStatus: watchRecord ? watchRecord?.watchStatus : null,
        episodeWatched: watchRecord ? watchRecord?.episodeWatched : null
      };
    })
  );
  return withExtended.sort((a, b) => b.helpful.numberOfHelpfulReviews - a.helpful.numberOfHelpfulReviews);
};

const getExtendedEpisodeReviews = async (
  mediaId: number,
  seasonNumber: number,
  episodeNumber: number
): Promise<ExtendedEpisodeReview[]> => {
  const reviews = await getMediaEpisodeReviews(mediaId, seasonNumber, episodeNumber);
  const withExtended = await Promise.all(
    reviews.map(async (review) => {
      const helpfulData = await getReviewHelpful(review.id);
      const helpfulRating = await getUserReviewHelpfulRating(review.id);
      const user = await getUserSummary(review.userId);
      const withUserAndHelpful = { ...review, user, helpful: { ...helpfulData, isHelpful: helpfulRating?.helpful } };
      return withUserAndHelpful;
    })
  );
  return withExtended.sort((a, b) => b.helpful.numberOfHelpfulReviews - a.helpful.numberOfHelpfulReviews);
};

const getExtendedReview = async (reviewId: number): Promise<ExtendedEpisodeReview | ExtendOverallReview | null> => {
  const review = await getReview(reviewId);
  if (!review) return null;
  const helpfulData = await getReviewHelpful(review.id);
  const helpfulRating = await getUserReviewHelpfulRating(review.id);
  const user = await getUserSummary(review.userId);
  const withUserAndHelpful = { ...review, user, helpful: { ...helpfulData, isHelpful: helpfulRating?.helpful } };
  if (review.reviewType === ReviewType.EPISODE) return withUserAndHelpful as ExtendedEpisodeReview;
  const watchRecord = await getUserWatchlistRecord(review.mediaType, review.mediaId, review.userId);
  return {
    ...withUserAndHelpful,
    watchStatus: watchRecord ? watchRecord?.watchStatus : null,
    episodeWatched: watchRecord ? watchRecord?.episodeWatched : null
  } as ExtendOverallReview;
};

const getExtendedUserReviews = async (
  userId: number,
  reviewType: ReviewType
): Promise<(ExtendOverallReviewWithMediaHelpful | ExtendEpisodeReviewWithMediaHelpful)[]> => {
  const reviews = await getUserReviews(userId, reviewType);
  const withExtended = await Promise.all(
    reviews.map(async (review) => {
      const helpfulData = await getReviewHelpful(review.id);
      const helpfulRating = await getUserReviewHelpfulRating(review.id);
      const content = await getValidContentSummary(review.mediaType.toLowerCase() as any, review.mediaId);
      const withMediaAndHelpful = {
        ...review,
        title: content?.title,
        poster_path: content?.poster_path,
        number_of_episodes: content?.number_of_episodes,
        helpful: { ...helpfulData, isHelpful: helpfulRating?.helpful }
      };
      if (review.reviewType === ReviewType.EPISODE) return withMediaAndHelpful as ExtendEpisodeReviewWithMediaHelpful;
      const watchRecord = await getUserWatchlistRecord(review.mediaType, review.mediaId, review.userId);
      return {
        ...withMediaAndHelpful,
        watchStatus: watchRecord ? watchRecord?.watchStatus : null,
        episodeWatched: watchRecord ? watchRecord?.episodeWatched : null
      } as any as ExtendOverallReviewWithMediaHelpful;
    })
  );
  return withExtended.sort((a, b) => b.helpful.numberOfHelpfulReviews - a.helpful.numberOfHelpfulReviews);
};

export { getRecentReviewsWithMedia, getExtendedOverallReviews, getExtendedEpisodeReviews, getExtendedReview, getExtendedUserReviews };