'use server';

import { getContentSummary } from '@/features/media/service/tmdbService';
import { getUserSummary } from '@/features/profile/service/userProfileService';
import { getUserWatchRecord } from '@/features/watchlist/service/watchlistService';
import MediaType from '@/types/enums/IMediaType';
import handleServerError from '@/utils/handleServerError';
import {
  ExtendOverallReview,
  ExtendOverallReviewWithMedia,
  ExtendedEpisodeReview
} from '../types/interfaces/ExtendReviewResponse';
import {
  getMediaEpisodeReviews,
  getMediaOverallReviews,
  getRecentReviews,
  getReviewHelpful,
  getUserReviewHelpfulRating
} from './reviewViewService';

/**
 * This is for review services that depend on  other feature services
 */

const getRecentReviewsWithMedia = async (): Promise<ExtendOverallReviewWithMedia[]> => {
  try {
    const reviews = await getRecentReviews();
    const withMedia = await Promise.all(
      reviews.map(async (review) => {
        const user = await getUserSummary(review.userId);
        const type = review.mediaType.toLowerCase() as any;
        const details = await getContentSummary(type, review.mediaId);
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
      const watchRecord = await getUserWatchRecord(user.username, mediaType, mediaId);
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

export { getRecentReviewsWithMedia, getExtendedOverallReviews, getExtendedEpisodeReviews };
