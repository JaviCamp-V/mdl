'use server';

import tmdbClient from '@/clients/TMDBClient';
import { MediaImagesResponse, PersonImagesResponse } from '@/types/tmdb/IImage';
import MediaType from '@/types/tmdb/IMediaType';
import MovieDetails from '@/types/tmdb/IMovieDetails';
import PersonDetails, { Credits, PersonRoles,  } from '@/types/tmdb/IPeople';
import RatingResponse, { Rating } from '@/types/tmdb/IRating';
import SeasonDetails from '@/types/tmdb/ISeason';
import TagsResponse, { Tags } from '@/types/tmdb/ITags';
import TitleResponse, { Title } from '@/types/tmdb/ITitle';
import TranslationResponse, { Translation } from '@/types/tmdb/ITranslation';
import TVDetails from '@/types/tmdb/ITVDetails';
import WatchProviderResponse from '@/types/tmdb/IWatchProvider';
import logger from '@/utils/logger';

const endpoints = {
  search: 'search/multi',
  discover: 'discover/:mediaType',
  details: ':id',
  credits: 'credits',
  images: 'images',
  titles: 'alternative_titles',
  providers: 'watch/providers',
  ids: 'external_ids',
  tags: 'keywords',
  recommendations: 'recommendations',
  similar: 'similar',
  translations: 'translations',
  videos: 'videos',
  roles: 'combined_credits', // Get a list of all roles/jobs for a person.
  ratings: 'content_ratings', // Get a list of content ratings by country for a specific tv show
  season: 'season/:seasonNumber', // Get season details for a TV show.
  episode: 'season/:seasonNumber/episode/:episodeNumber' // Get details about a TV episode.
};

type MediaDetailsMap = {
  tv: TVDetails;
  movie: MovieDetails;
  person: PersonDetails;
};
const getDetails = async <T extends MediaType>(type: T, id: number): Promise<MediaDetailsMap[T] | null> => {
  try {
    logger.info(`Fetching details for ${type} with id ${id}`);
    const endpoint = `${type}/${endpoints.details}`.replace(':id', id.toString());
    const params = { append_to_response: 'external_ids' };
    const response = await tmdbClient.get<MediaDetailsMap[T]>(endpoint, params);
    return response;
  } catch (error: any) {
    logger.error(error.message);
    return null;
  }
};

const getTranslations = async (type: MediaType.tv | MediaType.movie, id: number): Promise<Translation[]> => {
  try {
    const code = ['en', 'ja', 'ko', 'ru'];
    logger.info(`Fetching translations for ${type} with id ${id}`);
    const endpoint = `${type}/${endpoints.details}/${endpoints.translations}`.replace(':id', id.toString());
    const response = await tmdbClient.get<TranslationResponse>(endpoint);
    return response.translations
      .filter((translation) => code.includes(translation.iso_639_1))
      .reduce((acc, translation) => {
        return acc.some((t) => t.iso_639_1 === translation.iso_639_1 || t.english_name === translation.english_name)
          ? acc
          : [...acc, translation];
      }, [] as Translation[])
      .sort((a, b) => code.indexOf(a.iso_639_1) - code.indexOf(b.iso_639_1));
  } catch (error: any) {
    logger.error(error.message);
    return [];
  }
};

const getTags = async (type: MediaType.tv | MediaType.movie, id: number): Promise<Tags[]> => {
  try {
    logger.info(`Fetching tags for ${type} with id ${id}`);
    const endpoint = `${type}/${endpoints.details}/${endpoints.tags}`.replace(':id', id.toString());
    const response = await tmdbClient.get<TagsResponse>(endpoint);
    return response?.keywords ?? response?.results ?? [];
  } catch (error: any) {
    logger.error(error.message);
    return [];
  }
};

const getTitles = async (type: MediaType.tv | MediaType.movie, id: number): Promise<Title[]> => {
  try {
    logger.info(`Fetching titles for ${type} with id ${id}`);
    const endpoint = `${type}/${endpoints.details}/${endpoints.titles}`.replace(':id', id.toString());
    const response = await tmdbClient.get<TitleResponse>(endpoint);
    return response?.titles ?? response?.results ?? [];
  } catch (error: any) {
    logger.error(error.message);
    return [];
  }
};

const getCredits = async (type: MediaType.tv | MediaType.movie, id: number): Promise<Credits> => {
  try {
    logger.info(`Fetching credits for ${type} with id ${id}`);
    const endpoint = `${type}/${endpoints.details}/${endpoints.credits}`.replace(':id', id.toString());
    const response = await tmdbClient.get<Credits>(endpoint);
    return response;
  } catch (error: any) {
    logger.error(error.message);
    return { id, cast: [], crew: [] };
  }
};

const getTVContentRating = async (id: number): Promise<Rating[]> => {
  try {
    logger.info(`Fetching content rating for tv with id ${id}`);
    const endpoint = `${MediaType.tv}/${endpoints.details}/${endpoints.ratings}`.replace(':id', id.toString());
    const response = await tmdbClient.get<RatingResponse>(endpoint);
    return response.results;
  } catch (error: any) {
    logger.error(error.message);
    return [];
  }
};

const getProviders = async (type: MediaType.tv | MediaType.movie, id: number): Promise<WatchProviderResponse> => {
  try {
    logger.info(`Fetching providers for ${type} with id ${id}`);
    const endpoint = `${type}/${endpoints.details}/${endpoints.providers}`.replace(':id', id.toString());
    const response = await tmdbClient.get<WatchProviderResponse>(endpoint);
    return response;
  } catch (error: any) {
    logger.error(error.message);
    return { id, results: {} };
  }
};

type MediaImageMap = {
  tv: MediaImagesResponse;
  movie: MediaImagesResponse;
  person: PersonImagesResponse;
};

const getImages = async <T extends MediaType>(type: T, id: number): Promise<MediaImageMap[T] | null> => {
  try {
    logger.info(`Fetching images for ${type} with id ${id}`);
    const endpoint = `${type}/${endpoints.details}/${endpoints.images}`.replace(':id', id.toString());
    const response = await tmdbClient.get<MediaImageMap[T]>(endpoint);
    return response;
  } catch (error: any) {
    logger.error(error.message);
    return null;
  }
};

const getTVSeason = async (id: number, seasonNumber: number): Promise<SeasonDetails | null> => {
  try {
    logger.info(`Fetching season ${seasonNumber} for tv with id ${id}`);
    const endpoint = `${MediaType.tv}/${endpoints.details}/${endpoints.season}`.replace(':id', id.toString()).replace(':seasonNumber', seasonNumber.toString());
    const response = await tmdbClient.get<SeasonDetails>(endpoint);
    return response;
  } catch (error: any) {
    logger.error(error.message);
    return null;
  }
};


const getRoles = async (id: number): Promise<PersonRoles> => {
  try {
    logger.info(`Fetching roles for person with id ${id}`);
    const endpoint = `${MediaType.person}/${endpoints.details}/${endpoints.roles}`.replace(':id', id.toString());
    const response = await tmdbClient.get<PersonRoles>(endpoint);
    return response;
  } catch (error: any) {
    logger.error(error.message);
    return { id, cast: [], crew: [] };
  }
}

export {
  getDetails,
  getTranslations,
  getTags,
  getTitles,
  getCredits,
  getTVContentRating,
  getProviders,
  getImages,
  getTVSeason,
  getRoles
};
