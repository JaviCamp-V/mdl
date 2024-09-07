import ContentSummary from '@/features/media/types/interfaces/ContentSummary';
import Genre from '@/features/media/types/interfaces/Genre';
import MediaDetailsProps from '@/types/common/MediaDetailsProps';
import Recommendation, { RecommendationWithLikes } from './Recommendation';

export interface Suggestion extends ContentSummary {
  recommendations: RecommendationWithLikes[];
}