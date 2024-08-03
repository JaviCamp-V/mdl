import ExternalID from "./IExternalID";
import { MediaSearchResult } from "./ISearchResposne";

export interface PersonBase {
  adult: boolean;
  gender: number;
  id: number;
  name: string;
  original_name: string;
  profile_path: string | null;
}

export interface Creator extends PersonBase {
  credit_id: string;
}

export interface Cast extends PersonBase {
  known_for_department: string;
  popularity: number;
  credit_id: string;
  character: string;
  cast_id: number;
  order: number;
}

export interface Crew extends PersonBase {
  known_for_department: string;
  popularity: number;
  credit_id: string;
  department: string;
  job: string;
}

export interface Credits {
  id: number;
  cast: Cast[];
  crew: Crew[];
}

export interface PersonRoles {
  id: number;
  cast: MediaSearchResult[];
  crew: MediaSearchResult[];
}

export default interface PersonDetails extends PersonBase {
  also_known_as: string[];
  biography: string;
  birthday: string;
  deathday: string | null;
  homepage: string | null;
  imdb_id: string;
  known_for_department: string;
  place_of_birth: string;
  popularity: number;
  external_ids: ExternalID
}

