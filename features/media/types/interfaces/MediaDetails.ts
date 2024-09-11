import MediaType from '@/types/enums/IMediaType';
import MovieDetails from './MovieDetails';
import PersonDetails from './People';
import SearchResponse, { MovieSearchResponse, PersonSearchResponse, TVSearchResponse } from './SearchResponse';
import TVDetails from './TVDetails';

export type MediaDetailsMap = {
  tv: TVDetails;
  movie: MovieDetails;
  person: PersonDetails;
};

export type DiscoverTypeMap = {
  [MediaType.tv]: TVSearchResponse;
  [MediaType.movie]: MovieSearchResponse;
};

export type MediaTypeWithMulti = MediaType | 'multi';

export type SearchTypeMap = DiscoverTypeMap & {
  [MediaType.person]: PersonSearchResponse;
  multi: SearchResponse;
};
