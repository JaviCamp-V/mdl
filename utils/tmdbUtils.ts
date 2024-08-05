import { capitalCase } from "change-case";

import countriesConfig from "@/libs/countriesConfig";

import { formatStringDate } from "./formatters";

import MediaType from "@/types/tmdb/IMediaType";
import { MediaSearchResult } from "@/types/tmdb/ISearchResposne";

const getTitle = (role: MediaSearchResult) => {
  return role.media_type === MediaType.movie ? role.title : role.name;
};

const getYear = (role: MediaSearchResult) => {
  const date = role.media_type === MediaType.movie ? role.release_date : role.first_air_date;
  return date ? formatStringDate(date).getFullYear() : 'TBA';
};

const getOrigin = (role: MediaSearchResult) => {
  const { media_type } = role;
  if (media_type === MediaType.movie) return capitalCase(media_type);
  const { origin_country } = role;
  if (!origin_country?.length) return 'Drama';
  const nationality =
    countriesConfig.find((country) => country.code === origin_country[0])?.nationality ?? origin_country[0];
  return capitalCase(`${nationality} Drama`);
};


export { getTitle, getYear, getOrigin };