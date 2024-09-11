// for movie and tv shows details
import MediaType from '@/types/enums/IMediaType';
import Genre from './Genre';

export default interface ContentSummary {
  mediaId: number;
  mediaType: MediaType.movie | MediaType.tv;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string | null;
  overview: string;
  original_title: string;
  origin_country: string[];
  recordId: number | null;
  number_of_episodes?: number | null;
  genres: Genre[];
}
