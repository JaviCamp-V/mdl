import MediaType from '@/types/enums/IMediaType';

export interface ReviewBase {
  mediaId: number;
  mediaType: MediaType.movie | MediaType.tv;
  headline: string;
  content: string;
  language: string;
  hasSpoilers?: boolean;
  overallRating: number;
}

export interface CreateEpisodeReview extends ReviewBase {
  season: number;
  episode: number;
}

export interface CreateOverallReview extends ReviewBase {
  hasCompleted?: boolean;
  storyRating: number;
  actingRating: number;
  musicRating: number;
  rewatchValueRating: number;
}
