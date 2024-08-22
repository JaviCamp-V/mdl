import Genre from '@/features/media/types/interfaces/Genre';
import MediaDetailsProps from '@/types/common/MediaDetailsProps';
import Recommendation from './Recommendation';

export interface Suggestion extends MediaDetailsProps {
  poster_path: string | null;
  title: string;
  vote_average: number;
  release_date: string;
  recordId: number | null;
  recommendations: Recommendation[];
  overview: string;
  original_title: string;
  country: string;
  genres: Genre[];
}