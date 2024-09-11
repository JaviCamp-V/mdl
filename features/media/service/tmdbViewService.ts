'use server';

import { unstable_cache } from 'next/cache';
import tmdbClient from '@/clients/TMDBClient';
import MediaType from '@/types/enums/IMediaType';
import handleServerError from '@/utils/handleServerError';
import logger from '@/utils/logger';
import { revalidate } from '@/libs/common';
import countries from '@/libs/countries';
import { without_genres } from '@/libs/genres';
import ContentRatingResponse, { ContentRating } from '../types/interfaces/ContentRating';
import ContentSummary from '../types/interfaces/ContentSummary';
import { MediaImageMap, MediaImagesResponse, PersonImagesResponse } from '../types/interfaces/ImageResponse';
import { DiscoverTypeMap, MediaDetailsMap, MediaTypeWithMulti, SearchTypeMap } from '../types/interfaces/MediaDetails';
import MovieDetails from '../types/interfaces/MovieDetails';
import Network, { NetworksSearchResponse } from '../types/interfaces/Network';
import PersonDetails, { Credits, PersonRoles } from '../types/interfaces/People';
import SearchResponse, {
  MovieSearchResponse,
  PersonSearchResponse,
  TVSearchResponse
} from '../types/interfaces/SearchResponse';
import SeasonDetails, { EpisodeDetails } from '../types/interfaces/Season';
import TVDetails from '../types/interfaces/TVDetails';
import TagsResponse, { Tags, TagsSearchResponse } from '../types/interfaces/Tags';
import TitleResponse, { Title } from '../types/interfaces/Title';
import TranslationResponse, { Translation } from '../types/interfaces/Translation';
import VideoResults from '../types/interfaces/VideosResponse';
import WatchProviderResponse from '../types/interfaces/WatchProvider';

const endpoints = {
  search_person: 'search/person',
  search: 'search',
  search_multi: 'search/multi',
  search_keyword: 'search/keyword',
  search_company: 'search/company',
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

// BASIC FUNCTIONS

/**
 * Fetches translations for overview of TV show or movie
 * @param {MediaType.tv | MediaType.movie} type
 * @param {number} id
 * @returns {Promise<Translation[]>}
 */
const getTranslations = async (type: MediaType.tv | MediaType.movie, id: number): Promise<Translation[]> => {
  try {
    logger.info(`Fetching translations for ${type} with id ${id}`);
    const endpoint = `${type}/${endpoints.details}/${endpoints.translations}`.replace(':id', id.toString());
    const response = await tmdbClient.get<TranslationResponse>(endpoint);
    return response.translations.reduce((acc, translation) => {
      return acc.some((t) => t.iso_639_1 === translation.iso_639_1 || t.english_name === translation.english_name)
        ? acc
        : [...acc, translation];
    }, [] as Translation[]);
  } catch (error: any) {
    logger.error(error.message);
    return [];
  }
};

/**
 * Fetches keywords for a TV show or movie
 * @param {MediaType.tv | MediaType.movie} type
 * @param {number} id
 * @returns {Promise<Tags[]>}
 */
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

/**
 * Fetches alternative titles for a TV show or movie
 * @param {MediaType.tv | MediaType.movie} type
 * @param {number} id
 * @returns {Promise<Title[]>}
 */
const getTitles = async (type: MediaType.tv | MediaType.movie, id: number): Promise<Title[]> => {
  try {
    logger.info(`Fetching titles for ${type} with id ${id}`);
    const endpoint = `${type}/${endpoints.details}/${endpoints.titles}`.replace(':id', id.toString());
    const response = await tmdbClient.get<TitleResponse>(endpoint);
    return response?.titles ?? response?.results ?? ([] as Title[]);
  } catch (error: any) {
    logger.error(error.message);
    return [];
  }
};

/**
 * Fetches credits for a TV show or movie
 * @param {MediaType.tv | MediaType.movie} type
 * @param {number} id
 * @returns {Promise<Credits>}
 */
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

/**
 * Fetches content rating for a TV show
 * @param {number} id
 * @returns {Promise<Rating[]>}
 */
const getTVContentRating = async (id: number): Promise<ContentRating[]> => {
  try {
    logger.info(`Fetching content rating for TV with id ${id}`);
    const endpoint = `${MediaType.tv}/${endpoints.details}/${endpoints.ratings}`.replace(':id', id.toString());
    const response = await tmdbClient.get<ContentRatingResponse>(endpoint);
    return response.results;
  } catch (error: any) {
    logger.error(error.message);
    return [];
  }
};

/**
 * Fetches providers for a TV or movie
 * @param {MediaType.tv | MediaType.movie} type
 * @param {number} id
 * @returns {Promise<WatchProviderResponse>}
 */
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

/**
 * Fetches videos for a TV show or movie
 * @param {MediaType.tv | MediaType.movie} type
 * @param {number} id
 * @returns {Promise<VideoResults>}
 */
const getVideos = async (type: MediaType.tv | MediaType.movie, id: number): Promise<VideoResults> => {
  try {
    logger.info(`Fetching videos for ${type} with id ${id}`);
    const endpoint = `${type}/${endpoints.details}/${endpoints.videos}`.replace(':id', id.toString());
    const response = await tmdbClient.get<VideoResults>(endpoint);
    return response;
  } catch (error: any) {
    logger.error(error.message);
    return { id, results: [] };
  }
};

/**
 * Fetches images for a media or a person
 * @param {MediaType} type
 * @param {number} id
 * @returns {Promise<MediaImageMap[T]>}
 */
const getImages = async <T extends MediaType>(type: T, id: number): Promise<MediaImageMap[T]> => {
  try {
    logger.info(`Fetching images for ${type} with id ${id}`);
    const endpoint = `${type}/${endpoints.details}/${endpoints.images}`.replace(':id', id.toString());
    const response = await tmdbClient.get<MediaImageMap[T]>(endpoint);
    return response;
  } catch (error: any) {
    logger.error(error.message);
    return {} as MediaImageMap[T];
  }
};

/**
 * Fetches a season's details for a TV show
 * @param {number} id
 * @param {number} seasonNumber
 * @returns {Promise<SeasonDetails>}
 */
const getSeasonDetails = async (id: number, seasonNumber: number): Promise<SeasonDetails> => {
  try {
    logger.info(`Fetching season ${seasonNumber} for TV show with id ${id}`);
    const endpoint = `${MediaType.tv}/${endpoints.details}/${endpoints.season}`
      .replace(':id', id.toString())
      .replace(':seasonNumber', seasonNumber.toString());
    const response = await tmdbClient.get<SeasonDetails>(endpoint);
    return response;
  } catch (error: any) {
    logger.error(error.message);
    return {} as SeasonDetails;
  }
};

/**
 * Fetches a episode's details for a TV show
 * @param {number} id
 * @param {number} seasonNumber
 * @param {number} episodeNumber
 */
const getEpisodeDetails = async (
  id: number,
  seasonNumber: number,
  episodeNumber: number
): Promise<EpisodeDetails | null> => {
  try {
    logger.info(`Fetching episode ${episodeNumber} for season ${seasonNumber} for TV show with id ${id}`);
    const endpoint =
      `${MediaType.tv}/${endpoints.details}/${endpoints.episode.replace(':seasonNumber', seasonNumber.toString()).replace(':episodeNumber', episodeNumber.toString())}`.replace(
        ':id',
        id.toString()
      );
    const response = await tmdbClient.get<EpisodeDetails>(endpoint);
    return response;
  } catch (error: any) {
    logger.error(error.message);
    return null;
  }
};

/**
 * Fetches a person's combined credits
 * @param {number} id
 * @returns {Promise<PersonRoles>}
 */
const getPersonRoles = async (id: number): Promise<PersonRoles> => {
  try {
    logger.info(`Fetching combined credits for person with id ${id}`);
    const endpoint = `${MediaType.person}/${endpoints.details}/${endpoints.roles}`.replace(':id', id.toString());
    const response = await tmdbClient.get<PersonRoles>(endpoint);
    return response;
  } catch (error: any) {
    logger.error(error.message);
    return { id, cast: [], crew: [] };
  }
};

/**
 * Fetches all the times a person appears as a cast or crew in movies or TV shows.
 *   Crew and cast are separated, and of TVSearchResult and MovieSearchResult list.
 * @param id number
 * @returns PersonRoles
 *
 */
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

/**
 * Fetches keyword details.
 * @param id number
 * @returns Tags
 *
 */
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

/**
 *
 * @param query
 * @returns Tags[]
 * @description Fetches search results for a keyword based on the query
 */
const getSearchKeyword = async (query: string): Promise<Tags[]> => {
  try {
    const params = new URLSearchParams({ query });
    const response = await tmdbClient.get<TagsSearchResponse>(endpoints.search_keyword, params);
    return response.results;
  } catch (error: any) {
    logger.error(error?.message);
    return [];
  }
};

/**
 * Fetches production companies based on the query
 * @param query string
 * @returns Network[]
 * @description Fetches search results for a network based on the query
 * */
const getSearchNetwork = async (query: string): Promise<Network[]> => {
  try {
    const params = new URLSearchParams({ query });
    const response = await tmdbClient.get<NetworksSearchResponse>(endpoints.search_company, params);
    return response?.results;
  } catch (error: any) {
    logger.error(error?.message);
    return [];
  }
};

/**
 * Fetches details for a TV show, movie, or person
 * @param {MediaType} type - TV or MOVIE or PERSON
 * @param {number} id
 * @returns {Promise<MediaDetailsMap[T] | null>}
 * @description Fetches details for a TV show, movie, or person.
 *  */

const getMediaDetails = async <T extends MediaType>(type: T, id: number): Promise<MediaDetailsMap[T] | null> => {
  try {
    logger.info(`Fetching details for ${type} with id ${id}`);
    const endpoint = `${type}/${endpoints.details}`.replace(':id', id.toString());
    const params = new URLSearchParams({ append_to_response: 'external_ids' });
    const response = await tmdbClient.get<MediaDetailsMap[T]>(endpoint, params);
    return response;
  } catch (error: any) {
    logger.error(error.message);
    return null;
  }
};

/**
 * Fetches discover results based on the type and params
 * @param type MediaType (TV or MOVIE)
 * @param params URLSearchParams (check DiscoverMovieSearchParams and DiscoverTVSearchParams for possible params)
 * @returns TVSearchResponse or MovieSearchResponse based on the type param
 * @description Fetches discover results based on the type and params.
 */

const getDiscoverContent = async <T extends MediaType.tv | MediaType.movie>(
  type: T,
  params: URLSearchParams
): Promise<DiscoverTypeMap[T]> => {
  try {
    logger.info(`Fetching discover for ${type} with params ${params.toString()}`);
    const endpoint = `${endpoints.discover}`.replace(':mediaType', type);
    const response = await tmdbClient.get<DiscoverTypeMap[T]>(endpoint, params);
    const results = response.results.map((result) => ({ ...result, media_type: type }));
    return { ...response, results };
  } catch (error: any) {
    logger.error(error.message);
    return { page: 0, results: [], total_pages: 0, total_results: 0 };
  }
};

const getSearchResultsByType = async <T extends MediaTypeWithMulti>(
  type: T,
  query: string,
  page?: string
): Promise<SearchTypeMap[T]> => {
  try {
    logger.info(`Fetching search for ${type} with query ${query}`);
    const endpoint = `${endpoints.search}/${type}`;
    const params = new URLSearchParams({ query, page: page ?? '1', include_adult: 'false' });
    const response = await tmdbClient.get<SearchTypeMap[T]>(endpoint, params);
    response.results = response.results.map((result) => ({
      ...result,
      media_type: result?.media_type ?? type
    })) as any[];
    return response;
  } catch (error: any) {
    logger.error(error.message);
    return { page: 0, results: [], total_pages: 0, total_results: 0 };
  }
};

/**
 * fetch details for movie or tv
 * @param {MediaType} mediaType
 *  @param {number} id
 * @returns {Promise<MovieDetails | TVDetails | null>}
 */

const getValidContentDetails = async <T extends MediaType.tv | MediaType.movie>(
  mediaType: T,
  id: number
): Promise<Omit<MediaDetailsMap, MediaType.person>[T] | null> => {
  try {
    const response = await getMediaDetailsCache(mediaType, id);
    if (!response) return null;
    logger.info('Validating details for %s with id %s', mediaType, id);
    const valid_counties = countries.map((country) => country.code).flat();
    const isValidCountry = response?.origin_country?.some((country) => valid_counties.includes(country));
    const isValidGenre = !without_genres.some((genre) => response?.genres?.some((g) => g.id === genre));
    if (!isValidCountry || !isValidGenre) {
      logger.info('Validations failed for %s with id %s', mediaType, id);
      return null;
    }
    return response;
  } catch (error: any) {
    logger.error(error.message);
    return null;
  }
};

/**
 * Fetches details for a person by their id
 * @param {number} id
 * @returns {Promise<PersonDetails>}
 */
const getPersonDetails = async (id: number): Promise<PersonDetails | null> => {
  try {
    logger.info(`Fetching details for person with id ${id}`);
    const response = await getMediaDetailsCache(MediaType.person, id);
    const asianCountries = countries.map((country) => country.fullName?.toLowerCase());
    const isValidPlaceOfBirth =
      !response?.place_of_birth || asianCountries.some((c) => response?.place_of_birth.toLowerCase().includes(c));
    return isValidPlaceOfBirth ? response : null;
  } catch (error: any) {
    logger.error(error.message);
    return null;
  }
};

// Cache functions

const getTranslationsCache = unstable_cache(getTranslations, [], { revalidate });
const getTagsCache = unstable_cache(getTags, [], { revalidate });
const getTitlesCache = unstable_cache(getTitles, [], { revalidate });
const getCreditsCache = unstable_cache(getCredits, [], { revalidate });
const getTVContentRatingCache = unstable_cache(getTVContentRating, [], { revalidate });
const getProvidersCache = unstable_cache(getProviders, [], { revalidate });
const getVideosCache = unstable_cache(getVideos, [], { revalidate });
const getImagesCache = unstable_cache(getImages, [], { revalidate });
const getSeasonDetailsCache = unstable_cache(getSeasonDetails, [], { revalidate });
const getEpisodeDetailsCache = unstable_cache(getEpisodeDetails, [], { revalidate });
const getPersonRolesCache = unstable_cache(getPersonRoles, [], { revalidate });
const getRolesCache = unstable_cache(getRoles, [], { revalidate });
const getKeywordDetailsCache = unstable_cache(getKeywordDetails, [], { revalidate });
const getSearchKeywordCache = unstable_cache(getSearchKeyword, [], { revalidate });
const getSearchNetworkCache = unstable_cache(getSearchNetwork, [], { revalidate });
const getMediaDetailsCache = unstable_cache(getMediaDetails, [], { revalidate });
const getDiscoverContentCache = async <T extends MediaType.tv | MediaType.movie>(
  type: T,
  params: URLSearchParams
): Promise<DiscoverTypeMap[T]> => {
  try {
    const getCached = unstable_cache(getDiscoverContent, [], {
      tags: [`discover-content-${type?.toString()}-${params?.toString()}`],
      revalidate
    });
    return await getCached(type, params);
  } catch (error: any) {
    handleServerError(error, `discovering content ${type} ${params.toString()}`);
    return [] as any as DiscoverTypeMap[T];
  }
};

const getSearchResultsByTypeCache = unstable_cache(getSearchResultsByType, [], { revalidate });
const getValidContentDetailsCache = unstable_cache(getValidContentDetails, [], { revalidate });
const getPersonDetailsCache = unstable_cache(getPersonDetails, [], { revalidate });

// Summary function
/**
 *  Return the content summary for display records
 * @param mediaType
 * @param id
 * @returns
 */
const getValidContentSummary = async (
  mediaType: MediaType.tv | MediaType.movie,
  id: number
): Promise<ContentSummary | null> => {
  const lowerCaseMediaType = mediaType.toLowerCase() as MediaType.tv | MediaType.movie;
  const content = await getValidContentDetailsCache(mediaType, id);
  if (!content) return null;
  const { poster_path, overview, vote_average, genres, origin_country, recordId } = content;
  const anyContent = content as any;
  const title = anyContent.title ?? anyContent.name;
  const original_title = anyContent.original_title ?? anyContent.original_name;
  const release_date = anyContent.release_date ?? anyContent.first_air_date;
  const number_of_episodes = anyContent?.number_of_episodes ?? 0;
  return {
    mediaId: id,
    mediaType: lowerCaseMediaType,
    title,
    poster_path,
    vote_average,
    release_date,
    overview,
    original_title,
    origin_country,
    recordId,
    genres,
    number_of_episodes
  };
};

export {
  getTranslationsCache as getTranslations,
  getTagsCache as getTags,
  getTitlesCache as getTitles,
  getCreditsCache as getCredits,
  getTVContentRatingCache as getTVContentRating,
  getProvidersCache as getProviders,
  getVideosCache as getVideos,
  getImagesCache as getImages,
  getSeasonDetailsCache as getSeasonDetails,
  getEpisodeDetailsCache as getEpisodeDetails,
  getPersonRolesCache as getPersonRoles,
  getRolesCache as getRoles,
  getKeywordDetailsCache as getKeywordDetails,
  getSearchKeywordCache as getSearchKeyword,
  getSearchNetworkCache as getSearchNetwork,
  getDiscoverContent,
  getDiscoverContentCache,
  getSearchResultsByType,
  getSearchResultsByTypeCache,
  getValidContentDetailsCache as getValidContentDetails,
  getPersonDetailsCache as getPersonDetails,
  getValidContentSummary
};
