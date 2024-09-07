'use server';

import { unstable_cache } from 'next/cache';
import { getWatchlist } from '@/features/watchlist/service/watchlistService';
import GeneralWatchlistRecord from '@/features/watchlist/types/interfaces/GeneralWatchlistRecord';
import tmdbClient from '@/clients/TMDBClient';
import Values from '@/types/common/Values';
import MediaType from '@/types/enums/IMediaType';
import { formatStringDate } from '@/utils/formatters';
import logger from '@/utils/logger';
import countries from '@/libs/countries';
import { without_genres } from '@/libs/genres';
import ContentRatingResponse, { ContentRating } from '../types/interfaces/ContentRating';
import ContentSummary from '../types/interfaces/ContentSummary';
import { MediaImagesResponse, PersonImagesResponse } from '../types/interfaces/ImageResponse';
import MovieDetails from '../types/interfaces/MovieDetails';
import Network, { NetworksSearchResponse } from '../types/interfaces/Network';
import PersonDetails, { Credits, PersonRoles } from '../types/interfaces/People';
import SearchResponse, { MediaSearchResult, MovieSearchResponse, MovieSearchResult, PersonSearchResponse, PersonSearchResult, TVSearchResponse, TVSearchResult } from '../types/interfaces/SearchResponse';
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

type MediaImageMap = {
  tv: MediaImagesResponse;
  movie: MediaImagesResponse;
  person: PersonImagesResponse;
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
const getEpisodeDetails = async (id: number, seasonNumber: number, episodeNumber: number): Promise<EpisodeDetails | null> => {
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
}

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

type MediaDetailsMap = {
  tv: TVDetails;
  movie: MovieDetails;
  person: PersonDetails;
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

type DiscoverTypeMap = {
  [MediaType.tv]: TVSearchResponse;
  [MediaType.movie]: MovieSearchResponse;
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

type SearchTypeMap = DiscoverTypeMap & {
  [MediaType.person]: PersonSearchResponse;
  multi: SearchResponse;
};

type MediaTypeWithMulti = MediaType | 'multi';

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

// Cache functions

const revalidate = 3600;
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
// const getDiscoverContentCache = unstable_cache(getDiscoverContent, [], { revalidate });
// const getSearchResultsByTypeCache = unstable_cache(getSearchResultsByType, [], { revalidate });

// Specific functions

/**
 * Check if the media is an Asian TV show or movie based on the countriesConfig and not a reality show, talk show, or animated
 * @param {BaseMediaItem} media
 * @returns {boolean}
 */
const isAsianMedia = (media: MediaSearchResult | TVDetails | MovieDetails): boolean => {
  const original_language = media?.original_language;
  const genre_ids = 'genres' in media ? media.genres.map((genre) => genre.id) : media.genre_ids;
  const languages = countries.map((country) => country.language).flat();
  return !without_genres.some((g) => genre_ids?.includes(g)) && languages?.includes(original_language);
};

/**
 * fetch details for movie or tv by its is
 * @param {MediaType} mediaType
 *  @param {number} id
 * @param {boolean} includeWatchRecord
 * @returns {Promise<MovieDetails | TVDetails | null>}
 */

const getContentDetails = async <T extends MediaType.tv | MediaType.movie>(
  mediaType: T,
  id: number,
  includeWatchRecord?: boolean
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
    if (!includeWatchRecord) return response;
    logger.info('Checking if user has a watch record  %s with id %s', mediaType, id);
    const watchlist = await getWatchlist();
    const record = watchlist.find((item) => item.mediaId === id && item.mediaType === mediaType.toUpperCase());
    return {
      ...response,
      recordId: record?.id ?? null,
      watchStatus: record?.watchStatus ?? null,
      recordRating: record?.rating ?? null
    };
  } catch (error: any) {
    logger.error(error.message);
    return null;
  }
};

// !Important only use if including watch record is not needed
const getContentDetailsCached = unstable_cache(getContentDetails, [], { revalidate: 3600 });



const getContentSummary = async (
  mediaType: MediaType.tv | MediaType.movie,
  id: number,
  includeWatchRecord?: boolean
): Promise<ContentSummary | null> => {
  const lowerCaseMediaType = mediaType.toLowerCase() as MediaType.tv | MediaType.movie;
  const content = includeWatchRecord
    ? await getContentDetails(lowerCaseMediaType, id, includeWatchRecord)
    : await getContentDetailsCached(lowerCaseMediaType, id);
  if (!content) return null;
  const { poster_path, overview, vote_average, genres, origin_country, recordId } = content;
  const anyContent = content as any;
  const title = anyContent.title ?? anyContent.name;
  const original_title = anyContent.original_title ?? anyContent.original_name;
  const release_date = anyContent.release_date ?? anyContent.first_air_date;
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
    genres
  };
};


/**
 * Fetches details for a movie by its id
 * @param {number} id
 * @param {boolean} includeWatchRecord
 * @returns {Promise<MovieDetails>}
 */
const getMovieDetails = async (id: number, includeWatchRecord?: boolean): Promise<MovieDetails | null> =>
  includeWatchRecord
    ? getContentDetails(MediaType.movie, id, includeWatchRecord)
    : getContentDetailsCached(MediaType.movie, id);

/**
 * Fetches details for a TV show by its id
 * @param {number} id
 * @returns {Promise<TVDetails>}
 */
const getTVDetails = async (id: number, includeWatchRecord?: boolean): Promise<TVDetails | null> =>
  includeWatchRecord
    ? getContentDetails(MediaType.tv, id, includeWatchRecord)
    : getContentDetailsCached(MediaType.tv, id);

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

const getPersonDetailsCached = unstable_cache(getPersonDetails, [], { revalidate: 3600 });

/**
 * Fetches discover results based on the type and params
 * @param type MediaType (TV or MOVIE)
 * @param params URLSearchParams (check DiscoverMovieSearchParams and DiscoverTVSearchParams for possible params)
 * @returns TVSearchResponse or MovieSearchResponse based on the type param
 * @description data filters out non-Asian content, reality shows, talk shows, and animated content,
 *     and sorts by votes from high to low,
 *   appends media_type to the results based on type (media_type is only returned using search/multi).
 *  appends recordId to the results based on the watchlist for logged-in users.
 */
// helper functions
const defaultDiscoverContentParams = {
  include_adult: 'false',
  include_video: 'false',
  without_genres: without_genres.join('|'),
  sort_by: 'vote_average.desc',
  with_origin_country: countries.map((country) => country.code).join('|')
};
const addTrailer = async <T>(results: MediaSearchResult): Promise<T> => {
  const response = await getVideosCache(results.media_type, results.id);
  const trailer = response.results.find((video) => video.type === 'Trailer') ?? null;
  return { ...results, trailer: trailer } as any as T;
};
const addRecordId = <T>(value: T, watchlist: GeneralWatchlistRecord[]): T => {
  const results = value as any;
  const recordId =
    watchlist.find((item) => item.mediaId === Number(results.id) && item.mediaType === results.media_type.toUpperCase())
      ?.id ?? null;
  return { ...results, recordId: recordId };
};

// main function
const getDiscoverType = async <T extends MediaType.tv | MediaType.movie>(
  type: T,
  params: URLSearchParams,
  includeTrailer?: boolean,
  includeWatchlist: boolean = true
): Promise<DiscoverTypeMap[T]> => {
  try {
    Object.entries(defaultDiscoverContentParams).forEach(([key, value]) => {
      if (params.has(key)) return;
      params.set(key, value);
    });

    const response = await getDiscoverContent(type, params);
    if (includeTrailer) {
      logger.info(`Fetching trailers for ${type} discover`);
      response.results = (await Promise.all(response.results.map(addTrailer))) as any[];
    }
    if (includeWatchlist) {
      logger.info(`Checking watchlist record for ${type} discover`);
      const watchlist = await getWatchlist();
      response.results = response.results.map((result) => addRecordId(result, watchlist)) as any[];
    }
    return response;
  } catch (error: any) {
    logger.error(error.message);
    return { page: 0, results: [], total_pages: 0, total_results: 0 };
  }
};

const getSearchMediaResults = async (
  type: MediaType.tv | MediaType.movie,
  query: string,
  page?: string
): Promise<TVSearchResponse | MovieSearchResponse> => {
  const response = await getSearchResultsByType(type, query, page);
  response.results = response.results.filter((result) => isAsianMedia(result)) as any[];
  return response;
};

const getMinSearchResponse = async <T extends MediaType.tv | MediaType.movie>(
  type: T,
  query: string,
  page?: string
): Promise<SearchTypeMap[T]> => {
  let numberPage = page ? parseInt(page) : 1;
  const combineResponse: SearchTypeMap[T] = { page: 0, results: [], total_pages: 0, total_results: 0 };
  for (let i = 0; i < 3; i++) {
    const response = await getSearchMediaResults(type, query, numberPage.toString());

    numberPage++;
    combineResponse.results = [...combineResponse.results, ...response.results] as any;
    combineResponse.total_pages = Math.max(combineResponse.total_pages, response.total_pages);
    if (combineResponse.results.length >= 15 || response.total_pages == response.page) {
      break;
    }
  }
  combineResponse.total_results = combineResponse.results.length;
  return combineResponse;
};

/**
 * Fetch search results for a TV show or movie based on the query
 * @param type MediaType (TV or MOVIE)
 * @param query string (search query)
 * @param page string (page number)
 * @returns TVSearchResponse or MovieSearchResponse based on the type param
 */

const getSearchContent = async (query: string, page?: string): Promise<TVSearchResult[] & MovieSearchResult[]> => {
  try {
    const types = [MediaType.tv, MediaType.movie] as (MediaType.tv | MediaType.movie)[];
    const response = await Promise.all(types.map((type) => getMinSearchResponse(type, query, page)));
    const results = response.map((res) => res.results).flat();
    return results as TVSearchResult[] & MovieSearchResult[];
  } catch (error: any) {
    logger.error(error.message);
    return [];
  }
};

/**
 *
 * @param person
 * @returns PersonSearchResult | null
 * @description Fetches biography and place of birth for a person it uses person details filter
 * so the person must be asian based on the countriesConfig
 */
const addBioAndPlaceOfBirth = async (person: PersonSearchResult): Promise<PersonSearchResult | null> => {
  const details = await getPersonDetailsCached(person.id);
  if (!details) return null;
  const { biography, place_of_birth } = details ?? {};
  return { ...person, biography, place_of_birth };
};

const addOriginKeywordsAndCompanies = async (media: MediaSearchResult): Promise<MediaSearchResult | null> => {
  const details = await getContentDetailsCached(media.media_type, media.id);
  if (!details) return null; // already filtered out non-asian content and without genres
  const { origin_country, production_companies, recordId } = details ?? {};
  const keywords = await getTagsCache(media.media_type, media.id);
  const response = await getVideosCache(media.media_type, media.id);
  const trailer = response.results.find((video) => video.type === 'Trailer') ?? null;
  const companies_ids = production_companies?.map((company) => company.id) ?? [];
  const keywords_ids = keywords?.map((keyword) => keyword.id) ?? [];
  return { ...media, origin_country, companies_ids, keywords_ids, trailer, recordId };
};

const addByDetailsByType = async (
  media: MediaSearchResult | PersonSearchResult
): Promise<MediaSearchResult | PersonSearchResult | null> => {
  if (media.media_type === MediaType.person) return await addBioAndPlaceOfBirth(media as PersonSearchResult);
  return await addOriginKeywordsAndCompanies(media as MediaSearchResult);
};

const filterByNationality = (media: PersonSearchResult, with_place_of_birth: string): boolean => {
  if (!media.place_of_birth) return true; // we can't filter out if we don't have place of birth
  const lowerCasePlaceOfBirth = media.place_of_birth.toLowerCase();
  const valid_countries = with_place_of_birth
    .split('|')
    .map((p) => countries.find((c) => c.code === p)?.fullName?.toLowerCase() ?? p);
  return valid_countries.some((country) => lowerCasePlaceOfBirth.includes(country));
};

const filterByGender = (media: PersonSearchResult, with_gender: string): boolean => {
  return media.gender === Number(with_gender);
};

const filterByOriginCountry = (media: MediaSearchResult, with_origin_country: string): boolean => {
  const valid_countries = with_origin_country.split('|');
  return media.origin_country?.some((country) => valid_countries.includes(country));
};

const filterByGenres = (media: MediaSearchResult, with_genres: string): boolean => {
  const valid_genres = with_genres.split('|').map((g) => Number(g));
  return media.genre_ids?.some((genre) => valid_genres.includes(genre));
};

const filterByKeywords = (media: MediaSearchResult, with_keywords: string): boolean => {
  const valid_keywords = with_keywords.split('|').map((k) => Number(k));
  return media.keywords_ids?.some((keyword) => valid_keywords.includes(keyword));
};

const filterByCompanies = (media: MediaSearchResult, with_companies: string): boolean => {
  const valid_companies = with_companies.split('|').map((c) => Number(c));
  return media.companies_ids?.some((company) => valid_companies.includes(company));
};

const filterByReleaseDate = (media: MediaSearchResult, release_date: string, comparison: 'gte' | 'lte'): boolean => {
  const media_release_date =
    media.media_type === MediaType.tv ? formatStringDate(media.first_air_date) : formatStringDate(media.release_date);
  const compare_date = formatStringDate(release_date);
  return comparison === 'gte' ? media_release_date >= compare_date : media_release_date <= compare_date;
};

const filterByRatings = (media: MediaSearchResult, ratings: string, comparison: 'gte' | 'lte'): boolean => {
  const compare_ratings = Number(ratings);
  const media_ratings = media.vote_average;
  return comparison === 'gte' ? media_ratings >= compare_ratings : media_ratings <= compare_ratings;
};

const popularityComparator = (
  a: MediaSearchResult | PersonSearchResult,
  b: MediaSearchResult | PersonSearchResult
): number => {
  return b.popularity - a.popularity;
};

const nameComparator = (
  a: MediaSearchResult | PersonSearchResult,
  b: MediaSearchResult | PersonSearchResult
): number => {
  const nameA = a.media_type === MediaType.movie ? a.title : a.name;
  const nameB = b.media_type === MediaType.movie ? b.title : b.name;
  return nameA.localeCompare(nameB);
};

const releaseDateComparator = (a: MediaSearchResult, b: MediaSearchResult): number => {
  const dateA =
    a.media_type === MediaType.tv ? formatStringDate(a.first_air_date ?? '') : formatStringDate(a.release_date ?? '');
  const dateB =
    b.media_type === MediaType.tv ? formatStringDate(b.first_air_date ?? '') : formatStringDate(b.release_date ?? '');
  return dateB.getTime() - dateA.getTime();
};

const voteAverageComparator = (a: MediaSearchResult, b: MediaSearchResult): number => {
  return b.vote_average - a.vote_average;
};

const applyFilters = (results: MediaSearchResult | PersonSearchResult, options: Values): boolean => {
  return Object.entries(options).every(([key, value]) => {
    switch (key) {
      case 'with_place_of_birth':
        return results.media_type !== MediaType.person || filterByNationality(results, value);
      case 'with_gender':
        return results.media_type !== MediaType.person || filterByGender(results, value);
      case 'with_origin_country':
        return results.media_type === MediaType.person || filterByOriginCountry(results, value);
      case 'with_genres':
        return results.media_type === MediaType.person || filterByGenres(results, value);
      case 'with_keywords':
        return results.media_type === MediaType.person || filterByKeywords(results, value);
      case 'with_companies':
        return results.media_type === MediaType.person || filterByCompanies(results, value);
      case 'first_air_date_gte':
        return results.media_type != MediaType.tv || filterByReleaseDate(results, value, 'gte');
      case 'first_air_date_lte':
        return results.media_type != MediaType.tv || filterByReleaseDate(results, value, 'lte');
      case 'release_date_gte':
        return results.media_type != MediaType.movie || filterByReleaseDate(results, value, 'gte');
      case 'release_date_lte':
        return results.media_type != MediaType.movie || filterByReleaseDate(results, value, 'lte');
      case 'vote_average_gte':
        return results.media_type == MediaType.person || filterByRatings(results, value, 'gte');
      case 'vote_average_lte':
        return results.media_type == MediaType.person || filterByRatings(results, value, 'lte');
      default:
        return true;
    }
  });
};

const searchWithFilters = async (
  query: string,
  type: MediaTypeWithMulti,
  page: string,
  options: Values
): Promise<SearchResponse> => {
  const response = await getSearchResultsByType(type, query, page);
  const results = await Promise.all(response.results.map((result) => addByDetailsByType(result)));
  const filtered = results.filter((result) => result && applyFilters(result, options));
  return { ...response, results: filtered as any[] };
};

const sortSearchResults = (
  type: MediaTypeWithMulti,
  results: (MediaSearchResult | PersonSearchResult)[],
  sort_by: string = 'popularity.desc'
): (MediaSearchResult | PersonSearchResult)[] => {
  const [sort, _] = sort_by.split('.');
  switch (sort) {
    case 'name':
      return results.sort(nameComparator);
    case 'release_date':
      return type === MediaType.tv || type === MediaType.movie
        ? (results as MediaSearchResult[]).sort(releaseDateComparator)
        : results.sort(popularityComparator);

    case 'vote_average':
      return type === MediaType.tv || type === MediaType.movie
        ? (results as MediaSearchResult[]).sort(voteAverageComparator)
        : results.sort(popularityComparator);

    default:
      return results.sort(popularityComparator);
  }
};

const adRecordIdToAll = async (
  results: (MediaSearchResult | PersonSearchResult)[]
): Promise<(MediaSearchResult | PersonSearchResult)[]> => {
  const watchlist = await getWatchlist();
  return results.map((result) => (result.media_type === MediaType.person ? result : addRecordId(result, watchlist)));
};
const searchWithPagination = async (
  query: string,
  type: MediaTypeWithMulti,
  options: Values
): Promise<SearchResponse> => {
  const maxResults = 20 * 5;
  const maxFetch = 6;
  const results = [] as any[];
  let response: SearchResponse;
  const { sort_by, ...filters } = options;
  for (let page = 1; page <= maxFetch; page++) {
    response = await searchWithFilters(query, type, page.toString(), filters);
    results.push(...response.results);
    if (results.length >= maxResults || response.page === response.total_pages) {
      break;
    }
  }
  const sortedResults = sortSearchResults(type, results, sort_by);
  const finalResults = await adRecordIdToAll(sortedResults);
  return { page: 1, results: finalResults, total_pages: 1, total_results: results.length, pagingMethod: 'custom' };
};

const getSearchResults = async (options: Values): Promise<SearchResponse> => {
  const { query, type, page, ...rest } = options;
  if (query) return await searchWithPagination(query, (type as MediaTypeWithMulti) ?? 'multi', rest);
  return await getDiscoverType(type, new URLSearchParams({ ...rest, page }), true);
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
  getMovieDetails,
  getTVDetails,
  getPersonDetails,
  getDiscoverType,
  getContentDetails,
  getSearchContent,
  getSearchResults,
  getContentSummary
};