import { capitalCase } from 'change-case';
import MediaType from '@/types/tmdb/IMediaType';
import MovieDetails from '@/types/tmdb/IMovieDetails';
import { MediaSearchResult } from '@/types/tmdb/ISearchResposne';
import TVDetails from '@/types/tmdb/ITVDetails';
import countries from '@/libs/countries';
import { formatStringDate } from './formatters';

const getTitle = (role: MediaSearchResult) => {
  return role.media_type === MediaType.movie ? role.title : role.name;
};

const hasRelease = (media: MediaSearchResult | MovieDetails | TVDetails, type: MediaType) => {
  const date = type === MediaType.movie ? (media as any)?.release_date : (media as any).first_air_date;
  return new Date(date) < new Date();
};
const getYear = (role: MediaSearchResult) => {
  const date = role.media_type === MediaType.movie ? role.release_date : role.first_air_date;
  return date ? formatStringDate(date).getFullYear() : 'TBA';
};

const getOrigin = (role: MediaSearchResult) => {
  const { media_type } = role;
  if (media_type === MediaType.movie) return capitalCase(media_type);
  const { origin_country } = role;
  if (!origin_country?.length) return 'Drama';
  const nationality = countries.find((country) => country.code === origin_country[0])?.nationality ?? origin_country[0];
  return capitalCase(`${nationality} Drama`);
};

export { getTitle, getYear, getOrigin, hasRelease };
