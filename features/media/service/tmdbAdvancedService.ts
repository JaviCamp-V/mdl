'use server';

import { getUserWatchlistRecordByMedia, getWatchlist } from '@/features/watchlist/service/watchlistViewService';
import GeneralWatchlistRecord from '@/features/watchlist/types/interfaces/GeneralWatchlistRecord';
import Values from '@/types/common/Values';
import MediaType from '@/types/enums/IMediaType';
import { formatStringDate } from '@/utils/formatters';
import logger from '@/utils/logger';
import countries from '@/libs/countries';
import { without_genres } from '@/libs/genres';
import ContentSummary from '../types/interfaces/ContentSummary';
import { DiscoverTypeMap, MediaDetailsMap, MediaTypeWithMulti, SearchTypeMap } from '../types/interfaces/MediaDetails';
import MovieDetails from '../types/interfaces/MovieDetails';
import SearchResponse, {
  MediaSearchResult,
  MovieSearchResponse,
  MovieSearchResult,
  PersonSearchResult,
  TVSearchResponse,
  TVSearchResult
} from '../types/interfaces/SearchResponse';
import TVDetails from '../types/interfaces/TVDetails';
import {
  getDiscoverContent,
  getPersonDetails,
  getSearchResultsByType,
  getTags,
  getValidContentDetails,
  getValidContentSummary,
  getVideos
} from './tmdbViewService';

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
    const response = await getValidContentDetails(mediaType, id);
    if (!response) return null;
    if (!includeWatchRecord) return response;
    logger.info('Checking if user has a watch record  %s with id %s', mediaType, id);
    const record = await getUserWatchlistRecordByMedia(mediaType, id);
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

const getContentSummary = async (
  mediaType: MediaType.tv | MediaType.movie,
  id: number,
  includeWatchRecord?: boolean
): Promise<ContentSummary | null> => {
  const content = await getValidContentSummary(mediaType, id);
  if (!content || !includeWatchRecord) return content;
  const record = await getUserWatchlistRecordByMedia(mediaType, id);
  return { ...content, recordId: record ? record.id : null };
};

/**
 * Fetches details for a movie by its id
 * @param {number} id
 * @param {boolean} includeWatchRecord
 * @returns {Promise<MovieDetails>}
 */
const getMovieDetails = async (id: number, includeWatchRecord?: boolean): Promise<MovieDetails | null> =>
  getContentDetails(MediaType.movie, id, includeWatchRecord);

/**
 * Fetches details for a TV show by its id
 * @param {number} id
 * @returns {Promise<TVDetails>}
 */
const getTVDetails = async (id: number, includeWatchRecord?: boolean): Promise<TVDetails | null> =>
  getContentDetails(MediaType.tv, id, includeWatchRecord);

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
  const details = await getPersonDetails(person.id);
  if (!details) return null;
  const { biography, place_of_birth } = details ?? {};
  return { ...person, biography, place_of_birth };
};

const addOriginKeywordsAndCompanies = async (media: MediaSearchResult): Promise<MediaSearchResult | null> => {
  const details = await getValidContentDetails(media.media_type, media.id);
  if (!details) return null; // already filtered out non-asian content and without genres
  const { origin_country, production_companies, recordId } = details ?? {};
  const keywords = await getTags(media.media_type, media.id);
  const response = await getVideos(media.media_type, media.id);
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
  getMovieDetails,
  getTVDetails,
  getDiscoverType,
  getContentDetails,
  getSearchContent,
  getSearchResults,
  getContentSummary
};
