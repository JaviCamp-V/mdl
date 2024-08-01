'use server';
import tmdbClient from '@/clients/TMDBClient';
import countries from '@/libs/countires';
import DramaDetails from '@/types/drama/IDramaDetails';
import { minusDays, minusYears } from '@/utils/dateUtils';
import { formatDate } from '@/utils/formatters';

interface SearchResult {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  first_air_date: string;
  name: string;
  vote_average: number;
  vote_count: number;
}

interface PageResponse {
  page: number;
  results: SearchResult[];
  total_pages: number;
  total_results: number;
}

const endpoints = {
  changes: '/movie/changes',
  discover: 'discover/tv', // search Find TV shows using over 30 filters and sort options.
  search: {
    movie: '/search-movie',
    tv: '/search-tv',
    person: '/search-person',
    multi: '/search-multi' // Use multi search when you want to search for movies, TV shows and people in a single request.
  },
  details: 'tv/:id', // Get the primary TV show details by id.
  onTheAir: 'tv/on_the_air', // Get a list of TV shows that are currently on the air.
  popular: 'tv/popular', // Get a list of the current popular TV shows on TMDb. This list updates daily.
  topRated: 'tv/top_rated' // Get a list of the top rated TV shows on TMDb.
};



const getDetails = async (id: number, all?:boolean ): Promise<DramaDetails | null> => {
  try {
    const params = all
      ? new URLSearchParams({
          append_to_response: 'watch/providers,images,alternative_titles,images,aggregate_credits,external_ids'
        })
      : new URLSearchParams();
    return tmdbClient.get<DramaDetails>(endpoints.details.replace(':id', id.toString()), params);
  } catch (e) {
    console.error(e);
    return null;
  }
}

const genres = [
  {
    id: 10759,
    name: 'Action & Adventure'
  },
  {
    id: 16,
    name: 'Animation'
  },
  {
    id: 35,
    name: 'Comedy'
  },
  {
    id: 80,
    name: 'Crime'
  },
  {
    id: 99,
    name: 'Documentary'
  },
  {
    id: 18,
    name: 'Drama'
  },
  {
    id: 10751,
    name: 'Family'
  },
  {
    id: 10762,
    name: 'Kids'
  },
  {
    id: 9648,
    name: 'Mystery'
  },
  {
    id: 10763,
    name: 'News'
  },
  {
    id: 10764,
    name: 'Reality'
  },
  {
    id: 10765,
    name: 'Sci-Fi & Fantasy'
  },
  {
    id: 10766,
    name: 'Soap'
  },
  {
    id: 10767,
    name: 'Talk'
  },
  {
    id: 10768,
    name: 'War & Politics'
  },
  {
    id: 37,
    name: 'Western'
  }
];

/*
No animation, no news, no reality, no talk, no soap, no documentary
*/
const without_genres = [
  16,
  10764,
  10767,
  99,
  10766,
  10763

]

/*
0: Returning Series
1: Planned
2: In Production
3: Ended
4: Canceled
5: Pilot
*/
const today = new Date();
const startOfWeek = new Date(today);
startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
const endOfWeek = new Date(startOfWeek);
endOfWeek.setDate(startOfWeek.getDate() + 6);

const startingThisWeek = new URLSearchParams({
  sort_by: 'popularity.desc',
  'first_air_date.gte': formatDate(startOfWeek),
  'first_air_date.lte': formatDate(endOfWeek),
  language: 'en-US',
  without_genres: without_genres.join('|'),
  with_origin_country: Object.keys(countries).join('|'),
});
//air_date.gte=${startOfWeek}&air_date.lte=${endOfWeek}
const endingThisWeek = new URLSearchParams({
  sort_by: 'vote_average.desc',
  language: 'en-US',
  'first_air_date.gte': formatDate(minusYears(new Date(), 1)),
  'air_date.gte': formatDate(startOfWeek),
  'air_date.lte': formatDate( minusDays(endOfWeek, 1)),
  without_genres: without_genres.join('|'),
  with_origin_country: Object.keys(countries).join('|'),
  // with_status: '3|0'
});

const onTheAir = new URLSearchParams({
  sort_by: 'vote_average.desc',
  language: 'en-US',
  'air_date.gte': '{min_date}',
  'air_date.lte': '{max_date}',
  without_genres: without_genres.join(','),
  with_origin_country: Object.keys(countries).join('|')
});

const mostPopular = new URLSearchParams({
  // sort_by: 'popularity.desc',
  sort_by: 'vote_average.desc',
  language: 'en-US',
  'vote_count.gte':'200',
  without_genres: without_genres.join('|'),
  with_origin_country: Object.keys(countries).join('|')
});
const discoverDramas = async(params: any): Promise<PageResponse> => {
  try {
    const response = await Promise.all(Object.keys(countries).map(async (country) => {
      const countryParams = new URLSearchParams(params);
      countryParams.append('with_origin_country', country);
      return await tmdbClient.get<PageResponse>(endpoints.discover, countryParams);
    }));
    return response.reduce((acc, val) => {
      acc.page += val.page;
      acc.results.push(...val.results);
      acc.total_pages += val.total_pages;
      acc.total_results += val.total_results;
      return acc;
    }, { page: 0, results: [], total_pages: 0, total_results: 0 });
  } catch (e) {
    console.error(e);
    return { page: 0, results: [], total_pages: 0, total_results: 0 };
  }
}


const getStartingThisWeek = async(): Promise<SearchResult[]> => {
  try {
    const response = await tmdbClient.get<PageResponse>(endpoints.discover, startingThisWeek)
    return response.results.filter(
      (drama) => drama?.poster_path && drama.original_name !== drama.name && drama.genre_ids.length
    ).sort((a, b) => a.popularity - b.popularity);
  } catch (e) {
    console.error(e);
    return [];
  }
}

const getEndingThisWeek = async(): Promise<SearchResult[]> => {
  try {
    const response = await tmdbClient.get<PageResponse>(endpoints.discover, endingThisWeek)
    const filtered  = response.results
         .filter((drama) => drama?.poster_path && drama.original_name !== drama.name && drama.genre_ids.length)// filter out where name is not english
         .sort((a, b) => a.popularity - b.popularity);
    return filtered;  
  } catch (e) {
    console.error(e);
    return [];
  }
}

const getAirings = async(): Promise<SearchResult[]> => {
  try {
    const response = await tmdbClient.get<PageResponse>(endpoints.discover, onTheAir)
    return response.results.filter(
      (drama) => drama?.poster_path && drama.original_name !== drama.name && drama.genre_ids.length
    )
  } catch (e) {
    console.error(e);
    return [];
  }
}

const getPopular = async(): Promise<SearchResult[]> => {
  try {
    const response = await tmdbClient.get<PageResponse>(endpoints.discover, mostPopular)
    return response.results.filter(
      (drama) => drama?.poster_path && drama.original_name !== drama.name && drama.genre_ids.length
    )
  } catch (e) {
    console.error(e);
    return [];
  }
}

export { getAirings, getStartingThisWeek, getEndingThisWeek, getPopular ,getDetails };
