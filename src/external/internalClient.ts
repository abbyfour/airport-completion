import { Scoreboard } from "@/database/db";
import {
  AirportProperties,
  AirportWithUsers,
} from "@/database/entities/airport";
import { UserProperties } from "@/database/entities/user";

type Error = { error: string };

export class InternalClient {
  private constructor() {}

  private static countries: GeoJSON.FeatureCollection | undefined = undefined;

  private static readonly url = "/api";

  public static isError(response: any): response is Error {
    return "error" in response;
  }

  public static generateFingerprint(fingerprint: number): number {
    return (fingerprint + 1) % 1000000;
  }

  public static async attemptLogin(
    username: string,
    password: string
  ): Promise<UserProperties | Error> {
    return await InternalClient.post<UserProperties>("/user/login", {
      username,
      password,
    });
  }

  public static async signup(
    properties: Omit<UserProperties, "id">
  ): Promise<UserProperties | Error> {
    return await InternalClient.post<UserProperties>(
      "/user/signup",
      properties
    );
  }

  public static async fetchAirports(): Promise<AirportWithUsers[] | Error> {
    return await InternalClient.get<AirportWithUsers[]>("/airports");
  }

  public static async registerAirport(
    userId: number,
    airport: AirportProperties
  ): Promise<AirportWithUsers | Error> {
    return await InternalClient.post<AirportWithUsers>("/airports/register", {
      user_id: userId,
      ...airport,
    });
  }

  public static async deregisterAirport(
    userId: number,
    airportId: number
  ): Promise<undefined> {
    await InternalClient.post<AirportWithUsers>("/airports/deregister", {
      user_id: userId,
      airport_id: airportId,
    });
  }

  public static async fetchCountriesGeoJSON(): Promise<GeoJSON.FeatureCollection> {
    if (this.countries) return this.countries;

    const data = await fetch("/countries.geojson");

    const geojson = await data.json();
    this.countries = geojson;

    return geojson;
  }

  public static async scoreboard(): Promise<Scoreboard> {
    return await InternalClient.get("/airports/scoreboard");
  }

  private static async get<T = any>(path: string): Promise<T> {
    console.log("Fetching ", this.joinPaths(this.url, path));

    const response = await fetch(this.joinPaths(this.url, path));

    return await response.json();
  }

  private static async post<T = any>(
    path: string,
    body: Record<string, string | number>
  ): Promise<T> {
    console.log("Posting to ", this.joinPaths(this.url, path));

    const response = await fetch(this.joinPaths(this.url, path), {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    try {
      return await response.json();
    } catch (e) {
      return undefined as any;
    }
  }

  private static joinPaths(base: string, path: string): string {
    return `${base}${path.startsWith("/") ? path : `/${path}`}`;
  }
}
