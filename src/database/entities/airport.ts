import { UserProperties } from "./user";

export interface AirportProperties {
  id: number;
  iata_code: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

export class Airport {
  public static readonly schema = `
    CREATE TABLE IF NOT EXISTS airports (
        id INTEGER PRIMARY KEY,
        iata_code TEXT NOT NULL,
        name TEXT NOT NULL,
        country TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL
      );
  `;

  public id: number;
  public name: string;
  public iata_code: string;
  public country: string;
  public latitude: number;
  public longitude: number;

  constructor(
    name: string,
    iata_code: string,
    country: string,
    latitude: number,
    longitude: number,
    id: number
  ) {
    this.name = name;
    this.iata_code = iata_code;
    this.country = country;
    this.latitude = latitude;
    this.longitude = longitude;

    this.id = id;
  }
}

export class AirportWithUsers {
  constructor(
    public readonly airport: AirportProperties,
    public readonly users: UserProperties[]
  ) {}
}
