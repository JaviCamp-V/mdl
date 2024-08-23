interface Schedule {
  time: string;
  days: string[];
}

interface Rating {
  average: number | null;
}

interface Country {
  name: string;
  code: string;
  timezone: string;
}

interface Network {
  id: number;
  name: string;
  country: Country;
  officialSite: string | null;
}

interface Externals {
  tvrage: number | null;
  thetvdb: number;
  imdb: string | null;
}

interface Image {
  medium: string;
  original: string;
}

interface Link {
  href: string;
  name?: string;
}

interface Links {
  self: Link;
  previousepisode?: Link;
  nextepisode?: Link;
}

export default interface TvMazeDetails {
  id: number;
  url: string;
  name: string;
  type: string;
  language: string;
  genres: string[];
  status: string;
  runtime: number;
  averageRuntime: number;
  premiered: string;
  ended: string | null;
  officialSite: string;
  schedule: Schedule;
  rating: Rating;
  weight: number;
  network: Network;
  webChannel: string | null;
  dvdCountry: string | null;
  externals: Externals;
  image: Image;
  summary: string;
  updated: number;
  _links: Links;
}
