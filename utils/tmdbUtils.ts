import MediaType from "@/types/tmdb/IMediaType";
import { MediaSearchResult } from "@/types/tmdb/ISearchResposne";
import { formatStringDate } from "./formatters";

const getTitle = (role: MediaSearchResult) => {
  return role.media_type === MediaType.movie ? role.title : role.name;
};

const getYear = (role: MediaSearchResult) => {
  const date = role.media_type === MediaType.movie ? role.release_date : role.first_air_date;
  return date ? formatStringDate(date).getFullYear() : 'TBA';
};

export { getTitle, getYear };