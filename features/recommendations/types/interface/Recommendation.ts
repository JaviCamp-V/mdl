import ContentSummary from '@/features/media/types/interfaces/ContentSummary';
import UserSummary from '@/types/common/UserSummary';
import MakeRecommendation from './MakeRecommendation';

export default interface Recommendation extends MakeRecommendation {
  id: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface RecommendationWithLikes extends Recommendation {
  user: UserSummary;
  numberOfLikes: number;
  hasUserLiked: boolean;
}

export interface RecommendationDetails extends Recommendation {
  source: ContentSummary;
  suggested: ContentSummary;
  numberOfLikes: number;
  hasUserLiked: boolean;
}
