'use server';

import tmdbClient from '@/clients/TMDBClient';

import MediaType from '@/types/tmdb/IMediaType';
import TVDetails from '@/types/tmdb/ITVDetails';
import SeasonDetails from '@/types/tmdb/ISeason';
import MovieDetails from '@/types/tmdb/IMovieDetails';
import TagsResponse, { Tags } from '@/types/tmdb/ITags';
import SearchResponse from '@/types/tmdb/ISearchResposne';
import TitleResponse, { Title } from '@/types/tmdb/ITitle';
import RatingResponse, { Rating } from '@/types/tmdb/IRating';
import WatchProviderResponse from '@/types/tmdb/IWatchProvider';
import PersonDetails, { Credits, PersonRoles } from '@/types/tmdb/IPeople';
import TranslationResponse, { Translation } from '@/types/tmdb/ITranslation';
import { MediaImagesResponse, PersonImagesResponse } from '@/types/tmdb/IImage';

import logger from '@/utils/logger';
import countriesConfig from '@/libs/countriesConfig';
import { without_genres } from '@/libs/genres';

const endpoints = {
  search_person: 'search/person',
  search: 'search',
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
  episode: 'season/:seasonNumber/episode/:episodeNumber', // Get details about a TV episode.
  keyword: 'keyword/:id' // Get the details of a keyword.
};

type MediaDetailsMap = {
  tv: TVDetails;
  movie: MovieDetails;
  person: PersonDetails;
};
// TODO: filter out no asian tv shows, movies and persons
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
    return response?.titles ?? response?.results ?? [] as Title[];
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
    const endpoint = `${MediaType.tv}/${endpoints.details}/${endpoints.season}`
      .replace(':id', id.toString())
      .replace(':seasonNumber', seasonNumber.toString());
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
};

const getKeywordDetails = async (id: number): Promise<Tags> => {
  try {
    logger.info(`Fetching keyword with id ${id}`);
    const endpoint = `${endpoints.keyword}`.replace(':id', id.toString());
    const response = await tmdbClient.get<Tags>(endpoint);
    return response;
  } catch (error: any) {
    logger.error(error.message);
    return { id, name: '' };
  }
};

const defaultParams = {
  include_adult: 'false',
  include_video: 'false',
  without_genres: without_genres.join('|'),
  sort_by: 'vote_average.desc',
  with_origin_country: countriesConfig.map((country) => country.code).join('|')
};
const getDiscoverType = async (
  type: MediaType.tv | MediaType.movie,
  params: URLSearchParams
): Promise<SearchResponse> => {
  try {
    
    logger.info(`Fetching discover for ${type} with params ${params.toString()}`);
    Object.entries(defaultParams).forEach(([key, value]) => {
      if (params.has(key)) return;
      params.set(key, value);
    });

    const endpoint = `${endpoints.discover}`.replace(':mediaType', type);
    const response = await tmdbClient.get<SearchResponse>(endpoint, params);
    response.results = response.results.map((result) => ({ ...result, media_type: type })) as any;
    return response;
  } catch (error: any) {
    logger.error(error.message);
    return { page: 0, results: [], total_pages: 0, total_results: 0 };
  }
};

const getSearchType = async (type: MediaType, query: string, page?: string): Promise<SearchResponse> => {
  try {
    logger.info(`Fetching search for ${type} with query ${query}`);
    const endpoint = `${endpoints.search}/${type}`;
    const params = new URLSearchParams({ query, page: page ?? '1' });
    const response = await tmdbClient.get<SearchResponse>(endpoint, params);
    response.results = response.results.map((result) => ({ ...result, media_type: type })) as any;
    if (type !== MediaType.person) {
      const languages = countriesConfig.map((country) => country.language).flat();
      response.results = response.results.filter(
        ({ original_language, genre_ids }) =>
          languages.includes(original_language) && !genre_ids?.some((g) => without_genres.includes(g))
      ) as any;
    }
    return response;
  } catch (error: any) {
    logger.error(error.message);
    return { page: 0, results: [], total_pages: 0, total_results: 0 };
  }
};

const getSearchPerson = async (name: string, page?: string): Promise<SearchResponse> => {
  try {
    const response = await getSearchType(MediaType.person, name, page);
    const results = await Promise.all(
      response.results.map(async (person) => {
        const details = await getDetails(MediaType.person, person.id);
        const { biography, place_of_birth } = details ?? {};
        return { ...person, biography, place_of_birth };
      })
    );
    return { ...response, results: results as any };
  } catch (error: any) {
    logger.error(error.message);
    return { page: 0, results: [], total_pages: 0, total_results: 0 };
  }
};

interface SearchParams {
  query?: string;
  with_keywords?: string;
  with_genres?: string;
  page?: number | string;
}
const getSearchResults = async (options: SearchParams): Promise<SearchResponse> => {
  try {
    const { query, with_keywords, with_genres, page } = options;
    if (!query && !with_keywords && !with_genres) {
      return { page: 0, results: [], total_pages: 0, total_results: 0 };
    }
    const stringPage = page?.toString() ?? '1';

    if (options.with_keywords || options.with_genres) {
      const params = new URLSearchParams({
        page: stringPage,
        with_keywords: with_keywords ?? '',
        with_genres: with_genres ?? ''
      });
      const tv = await getDiscoverType(MediaType.tv, params);
      const movie = await getDiscoverType(MediaType.movie, params);
      const page = Math.max(tv.page, movie.page);
      const results = [...tv.results, ...movie.results];
      const total_pages = Math.max(tv.total_pages, movie.total_pages);
      const total_results = tv.total_results + movie.total_results;
      return { page, results, total_pages, total_results };
    }
    const tv = await getSearchType(MediaType.tv, query!, stringPage);
    const movie = await getSearchType(MediaType.movie, stringPage);
    const persons = await getSearchPerson(query!, stringPage);
    const current_page = Math.max(tv.page, movie.page, persons.page);
    const results = [...tv.results, ...movie.results, ...persons.results];
    const total_pages = Math.max(tv.total_pages, movie.total_pages, persons.total_pages);
    const total_results = tv.total_results + movie.total_results + persons.total_results;
    return { page: current_page, results, total_pages, total_results };
  } catch (error: any) {
    logger.error(error.message);
    return { page: 0, results: [], total_pages: 0, total_results: 0 };
  }
};

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
  getRoles,
  getSearchResults,
  getDiscoverType,
  getKeywordDetails
};
