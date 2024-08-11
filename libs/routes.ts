export const userRoutes = {
  profile: '/profile',
  watchlist: '/watchlist',
  custom_lists: '/lists',
  settings: '/settings'
};

const routes = {
  drama: '/drama/:id',
  tv: '/tv/:id',
  movie: '/movie/:id',
  person: '/person/:id',
  search: '/search',
  discover: '/discover',
  discoverAiring: '/discover/airing',
  discoverPopular: '/discover/popular',
  discoverUpcoming: '/discover/upcoming',
  home: '/',
  login: '/auth/signin',
  register: '/auth/signup',
  faq: '/faq',
  about: '/about',
  contact: '/contact',
  terms: '/terms',
  privacy: '/privacy',
  help: '/help',
  advertise: '/advertise',
  api: '/api',
  recommendation: '/recommendation',
  recommendationKoreanDrama: '/recommendation/korean-drama',
  recommendationKoreanMovie: '/recommendation/korean-movie',
  recommendationTop100KoreanDramas: '/recommendation/top-100-korean-dramas',
  recommendationTop100KoreanMovies: '/recommendation/top-100-korean-movies',
  user: userRoutes
};

export default routes;
