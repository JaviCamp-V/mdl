import { endOfWeek, lastDayOfWeek, startOfWeek } from 'date-fns';
import { plusDays } from './dateUtils';
import { formatDate } from './formatters';

export const trending = new URLSearchParams({
  sort_by: 'popularity.desc'
});

export const startingThisWeek = new URLSearchParams({
  sort_by: 'popularity.desc',
  with_release_type: '2|3',

  'first_air_date.gte': formatDate(startOfWeek(new Date())),
  'first_air_date.lte': formatDate(lastDayOfWeek(new Date()))
});

export const endingThisWeek = new URLSearchParams({
  sort_by: 'popularity.desc',
  with_release_type: '2|3',

  'air_date.gte': formatDate(startOfWeek(new Date())),
  'air_date.lte': formatDate(plusDays(endOfWeek(new Date()), 1))
});

export const upcomingTvShows = new URLSearchParams({
  with_release_type: '2|3',
  sort_by: 'popularity.desc',
  'first_air_date.gte': formatDate(plusDays(new Date(), 1))
});

export const mostPopular = new URLSearchParams({
  sort_by: 'vote_average.desc',
  language: 'en-US',
  'vote_count.gte': '200'
});

export const getTopAiring = (origin_country: string) =>
  new URLSearchParams({
    sort_by: 'popularity.desc',
    with_origin_country: origin_country,
    'air_date.gte': formatDate(plusDays(new Date(), 1)),
    'first_air_date.lte': formatDate(new Date()),
  });

export const getTop100 = (origin_country: string) =>
  new URLSearchParams({
    sort_by: 'vote_average.desc',
    language: 'en-US',
    'vote_count.gte': '200',
    'with_origin_country': origin_country
  });
