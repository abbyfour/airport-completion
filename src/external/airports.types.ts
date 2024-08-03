export interface AirportsResponse {
  type: string;
  features: RawAirport[];
}

export interface RawAirport {
  type: string;
  geometry: Geometry;
  properties: APIAirportProperties;
}

export interface Geometry {
  type: string;
  coordinates: number[];
}

export interface APIAirportProperties {
  id: number;
  country: Country;
  name: string;
  source: string;
  distance: null;
  match_relevance: MatchRelevance;
  match_level: number;
  region: Country;
  elevation: number;
  functions: string[];
  gps_code: null | string;
  home_link: null | string;
  iata: null | string;
  local_code: null | string;
  municipality: string;
  type: string;
  wikipedia: null | string;
}

export interface Country {
  code: string;
  name: string;
  continent?: string;
  wikipedia: string;
  local_code?: string;
}

export interface MatchRelevance {
  code: number;
  country: null;
  levenshtein: null;
  ts_rank: null;
  trgm_similarity: null;
  skipped_chunks: number;
}

export interface AirportsError {
  status: number;
  error: string[];
  message: string;
}
