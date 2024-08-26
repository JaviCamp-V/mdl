'use server';

import { getWatchlist } from '@/features/watchlist/service/watchlistService';
import GeneralWatchlistRecord from '@/features/watchlist/types/interfaces/GeneralWatchlistRecord';
import Search from '@mui/icons-material/Search';
import tmdbClient from '@/clients/TMDBClient';
import MediaType from '@/types/enums/IMediaType';
import logger from '@/utils/logger';
import countries from '@/libs/countries';
import { without_genres } from '@/libs/genres';
import ContentRatingResponse, { ContentRating } from '../types/interfaces/ContentRating';
import { MediaImagesResponse, PersonImagesResponse } from '../types/interfaces/ImageResponse';
import MovieDetails from '../types/interfaces/MovieDetails';
import Network, { NetworksSearchResponse } from '../types/interfaces/Network';
import PersonDetails, { Credits, PersonRoles } from '../types/interfaces/People';
import SearchResponse, {
  MediaSearchResult,
  MovieSearchResponse,
  MovieSearchResult,
  PersonSearchResponse,
  PersonSearchResult,
  TVSearchResponse,
  TVSearchResult
} from '../types/interfaces/SearchResponse';
import SeasonDetails from '../types/interfaces/Season';
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

/**
 * Check if the person is born in an Asian country based on the countriesConfig
 * @param {PersonSearchResult | PersonDetails} person
 * @returns {boolean}
 */
const isAsian = ({ place_of_birth }: PersonSearchResult | PersonDetails): boolean => {
  const asianCountries = countries.map((country) => country.fullName?.toLowerCase());
  return !place_of_birth || asianCountries.some((c) => place_of_birth.toLowerCase().includes(c));
};

/**
 * Check if the media is an Asian TV show or movie based on the countriesConfig and not a reality show, talk show, or animated
 * @param {BaseMediaItem} media
 * @returns {boolean}
 */
const isAsianMedia = (media: MediaSearchResult | TVDetails | MovieDetails): boolean => {
  const original_language = media?.original_language;
  const genre_ids = 'genres' in media ? media.genres.map((genre) => genre.id) : media.genre_ids;
  const languages = countries.map((country) => country.language).flat();
  return !without_genres.some((g) => genre_ids.includes(g)) && languages.includes(original_language);
};

type MediaDetailsMap = {
  tv: TVDetails;
  movie: MovieDetails;
  person: PersonDetails;
};

/**
 * Fetches details for a TV show, movie, or person
 * @param {MediaType} type - TV or MOVIE
 * @param {number} id
 * @returns {Promise<MediaDetailsMap[T] | null>}
 * @description If the content is not Asian, it returns null.
 *  If the type is a person, it checks if the person is born in an Asian country.
 * If the type is a TV show or movie, it checks if the original language is an Asian language.
 * If the user is logged in, it fetches the watchlist and appends recordId and watchStatus to the response.
 *  */
const getDetails = async <T extends MediaType>(
  type: T,
  id: number,
  includeWatchRecord?: boolean
): Promise<MediaDetailsMap[T] | null> => {
  try {
    logger.info(`Fetching details for ${type} with id ${id}`);
    const endpoint = `${type}/${endpoints.details}`.replace(':id', id.toString());
    const params = { append_to_response: 'external_ids' };
    const response = await tmdbClient.get<MediaDetailsMap[T]>(endpoint, params);
    const isValid = type === MediaType.person ? isAsian(response as any) : isAsianMedia(response as any);
    if (!isValid) {
      logger.info(`Content is not Asian, skipping...`);
      return null;
    }
    if (type === MediaType.person) return response;
    const watchlist = includeWatchRecord ? ((await getWatchlist()) as GeneralWatchlistRecord[]) : [];
    const record = watchlist.find((item) => item.mediaId === Number(id) && item.mediaType === type.toUpperCase());
    return { ...response, recordId: record?.id ?? null, watchStatus: record?.watchStatus ?? null };
  } catch (error: any) {
    logger.error(error.message);
    return null;
  }
};

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
): Promise<MediaDetailsMap[T] | null> => getDetails(mediaType, id, includeWatchRecord);

/**
 * Fetches details for a movie by its id
 * @param {number} id
 * @param {boolean} includeWatchRecord
 * @returns {Promise<MovieDetails>}
 */
const getMovieDetails = async (id: number, includeWatchRecord?: boolean): Promise<MovieDetails | null> =>
  getDetails(MediaType.movie, id, includeWatchRecord);

/**
 * Fetches details for a TV show by its id
 * @param {number} id
 * @returns {Promise<TVDetails>}
 */
const getTVDetails = async (id: number, includeWatchRecord?: boolean): Promise<TVDetails | null> =>
  getDetails(MediaType.tv, id, includeWatchRecord);

/**
 * Fetches details for a person by their id
 * @param {number} id
 * @returns {Promise<PersonDetails>}
 */
const getPersonDetails = async (id: number): Promise<PersonDetails | null> => getDetails(MediaType.person, id);

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
 * Search function that can search for TV shows, movies, or people based on the query and type
 * @param {string} query
 * @param {MediaType} type
 * @param {number} page
 * @returns {Promise<SearchResponse>}
 */
const search = async (query: string, type: MediaType, page = 1): Promise<SearchResponse> => {
  try {
    logger.info(`Searching for ${type} with query "${query}"`);
    const endpoint = `${endpoints.search}/${type}`;
    const params = { query, page };
    const response = await tmdbClient.get<SearchResponse>(endpoint, params);
    if (type === MediaType.person) {
      response.results = (response as PersonSearchResponse).results.filter(isAsian);
    } else {
      response.results = (response as TVSearchResponse | MovieSearchResponse).results.filter(isAsianMedia);
    }
    return response;
  } catch (error: any) {
    logger.error(error.message);
    return { page, results: [], total_results: 0, total_pages: 0 };
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

const defaultParams = {
  include_adult: 'false',
  include_video: 'false',
  without_genres: without_genres.join('|'),
  sort_by: 'vote_average.desc',
  with_origin_country: countries.map((country) => country.code).join('|')
};

const addMediaType = <T>(results: T, type: MediaType): T => {
  return { ...results, media_type: type };
};
const addTrailer = async <T>(results: MediaSearchResult): Promise<T> => {
  const response = await getVideos(results.media_type, results.id);
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

type DiscoverTypeMap = {
  [MediaType.tv]: TVSearchResponse;
  [MediaType.movie]: MovieSearchResponse;
};

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
const getDiscoverType = async <T extends MediaType.tv | MediaType.movie>(
  type: T,
  params: URLSearchParams,
  includeTrailer?: boolean,
  includeWatchlist: boolean = true
): Promise<DiscoverTypeMap[T]> => {
  try {
    logger.info(`Fetching discover for ${type} with params ${params.toString()}`);
    Object.entries(defaultParams).forEach(([key, value]) => {
      if (params.has(key)) return;
      params.set(key, value);
    });

    const endpoint = `${endpoints.discover}`.replace(':mediaType', type);
    const response = await tmdbClient.get<DiscoverTypeMap[T]>(endpoint, params);
    const watchlist = includeWatchlist ? ((await getWatchlist()) as GeneralWatchlistRecord[]) : [];
    response.results = await Promise.all(
      response.results.map(async (result) => {
        const data = addMediaType(result, type);
        const trailer = includeTrailer ? await addTrailer(data) : data;
        const record = includeWatchlist ? addRecordId(trailer, watchlist) : trailer;
        return record as any;
      })
    );
    return response;
  } catch (error: any) {
    logger.error(error.message);
    return { page: 0, results: [], total_pages: 0, total_results: 0 };
  }
};

type SearchTypeMap = DiscoverTypeMap & {
  [MediaType.person]: PersonSearchResponse;
};

/**
 * Check if the search result is a media search result.
 * @param media SearchResponse
 * @returns boolean
 */
const isMediaSearchResult = (media: SearchResponse): media is TVSearchResponse | MovieSearchResponse => {
  return media.results.length > 0 && media.results[0].media_type !== MediaType.person;
};

/**
 * Fetches search results based on the type and query,
 * @param type MediaType (TV or MOVIE)
 * @param query string (search query)
 * @param page string (page number)
 * @returns TVSearchResponse or MovieSearchResponse or PersonSearchResponse based on the type param
 * @description  filters out non-Asian content, reality shows, talk shows, and animated content,
 *    appends media_type to the results based on type (media_type is only returned using search/multi).
 * appends recordId to the results based on the watchlist for logged-in users.
 */
const getSearchType = async <T extends MediaType>(
  type: T,
  query: string,
  page?: string,
  includeTrailer?: false
): Promise<SearchTypeMap[T]> => {
  try {
    logger.info(`Fetching search for ${type} with query ${query}`);
    const endpoint = `${endpoints.search}/${type}`;
    const params = new URLSearchParams({ query, page: page ?? '1' });
    const response = await tmdbClient.get<SearchTypeMap[T]>(endpoint, params);
    response.results = response.results.map((result) => ({ ...result, media_type: type })) as any[];
    if (!isMediaSearchResult(response)) return response;
    const watchlist = (await getWatchlist()) as GeneralWatchlistRecord[];
    const filtered = response.results.filter((media) => isAsianMedia(media)) as any[];
    const results = await Promise.all(
      filtered.map(async (result) => {
        const trailer = includeTrailer ? await addTrailer<MediaSearchResult>(result) : result;
        const record = addRecordId<MediaSearchResult>(trailer, watchlist);
        return record;
      })
    );
    return { ...response, results, total_results: results.length };
  } catch (error: any) {
    logger.error(error.message);
    return { page: 0, results: [], total_pages: 0, total_results: 0 };
  }
};

const getMinSearchResponse = async <T extends MediaType>(
  type: T,
  query: string,
  page?: string,
  includeTrailer?: false
): Promise<SearchTypeMap[T]> => {
  let numberPage = page ? parseInt(page) : 1;
  const combineResponse: SearchTypeMap[T] = { page: 0, results: [], total_pages: 0, total_results: 0 };
  for (let i = 0; i < 3; i++) {
    const response = await getSearchType(type, query, numberPage.toString(), includeTrailer);
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
 * Fetches search results for a person based on the name
 * @param name Person name
 * @param page string (page number)
 * @returns PersonSearchResponse
 * @description appends biography and place_of_birth to the results,
 *   and filters by place of birth.
 */
const getSearchPerson = async (name: string, page?: string): Promise<SearchResponse> => {
  try {
    const response = await getMinSearchResponse(MediaType.person, name, page);
    const results = await Promise.all(
      response.results.map(async (person) => {
        const details = await getDetails(MediaType.person, person.id);
        const { biography, place_of_birth } = details ?? {};
        return { ...person, biography, place_of_birth } as PersonSearchResult;
      })
    );
    const filtered = results.filter((person) => isAsian(person));

    return { ...response, results: filtered };
  } catch (error: any) {
    logger.error(error.message);
    return { page: 0, results: [], total_pages: 0, total_results: 0 };
  }
};

/**
 * Fetch search results fror a TV show or movie based on the query
 * @param type MediaType (TV or MOVIE)
 * @param query string (search query)
 * @param page string (page number)
 * @returns TVSearchResponse or MovieSearchResponse based on the type param
 */

const getSearchContent = async (
  query: string,
  page?: string,
  includeTrailer?: false
): Promise<TVSearchResult[] & MovieSearchResult[]> => {
  try {
    const types = [MediaType.tv, MediaType.movie];
    const response = await Promise.all(types.map((type) => getMinSearchResponse(type, query, page, includeTrailer)));
    const results = response.map((res) => res.results).flat();
    return results as TVSearchResult[] & MovieSearchResult[];
  } catch (error: any) {
    logger.error(error.message);
    return [];
  }
};

interface SearchParams {
  query?: string;
  keywords?: string;
  genre?: string;
  page?: number | string;
}

/**
 * Fetches search results based on the options.
 * @param options SearchParams
 * @returns SearchResponse
 * @description If with_keywords or with_genres is provided, fetches discover TV or movie based on the options.
 *  If query is provided, fetches search TV, movie, and person based on the query.
 *  Note: query doesn't work with genres and keywords.
 */
const getSearchResults = async (options: SearchParams): Promise<SearchResponse> => {
  try {
    const { query, keywords, genre, page } = options;
    if (!query && !keywords && !genre) {
      return { page: 0, results: [], total_pages: 0, total_results: 0 };
    }
    const stringPage = page?.toString() ?? '1';

    if (keywords || genre) {
      const params = new URLSearchParams({
        page: stringPage,
        with_keywords: keywords ?? '',
        with_genres: genre ?? ''
      });
      const tv = await getDiscoverType(MediaType.tv, params, true);
      const movie = await getDiscoverType(MediaType.movie, params, true);
      const page = Math.max(tv.page, movie.page);
      const results = [...tv.results, ...movie.results];
      const total_pages = Math.max(tv.total_pages, movie.total_pages);
      const total_results = tv.total_results + movie.total_results;
      return { page, results, total_pages, total_results };
    }

    const tv = await getMinSearchResponse(MediaType.tv, query!, stringPage);
    const movie = await getMinSearchResponse(MediaType.movie, query!, stringPage);
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

export {
  getImages,
  getTitles,
  getTags,
  search,
  getCredits,
  getProviders,
  getMovieDetails,
  getSeasonDetails,
  getTVDetails,
  getPersonRoles,
  getTranslations,
  getPersonDetails,
  getTVContentRating,
  getRoles,
  getKeywordDetails,
  getVideos,
  getDiscoverType,
  getSearchResults,
  getContentDetails,
  getSearchType,
  getSearchContent,
  getSearchKeyword,
  getSearchNetwork
};