import UserSummary from '@/types/common/UserSummary';
import MakeRecommendation from './MakeRecommendation';

export default interface Recommendation extends MakeRecommendation {
  id: number;
  user: UserSummary;
  createdAt: string;
  updatedAt: string;
  numberOfLikes: number;
  hasUserLiked: boolean;
}
