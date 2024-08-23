import { capitalCase } from 'change-case';
import { ImageSizes } from '@/types/common/ImageSizes';
import MediaType from '@/types/enums/IMediaType';
import ImageType from '@/types/enums/ImageType';
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

const getImagePath = <T extends ImageType>(path: string | null, type?: T, size?: ImageSizes[T]) => {
  if (!path) return '/static/images/no_poster.jpg';
  const defaultSize = type === ImageType.poster ? 'w342' : 'w300';
  const src = `https://image.tmdb.org/t/p/${size ?? defaultSize}${path}`;
  return src;
};

export { getTitle, getYear, getOrigin, hasRelease, getImagePath };
