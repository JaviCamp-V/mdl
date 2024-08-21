import { capitalCase } from 'change-case';
import MediaType from '@/types/enums/IMediaType';
import { formatStringDate } from '@/utils/formatters';
import countries from '@/libs/countries';
import MovieDetails from '../types/interfaces/MovieDetails';
import { MediaSearchResult } from '../types/interfaces/SearchResponse';
import TVDetails from '../types/interfaces/TVDetails';

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
