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