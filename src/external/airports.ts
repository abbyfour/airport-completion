import { AirportsError, AirportsResponse } from "./airports.types";

export class AirportLookupAPI {
  private constructor() {}

  private static readonly url = "https://port-api.com";

  public static async fetchAirport(
    airportCode: string
  ): Promise<AirportsResponse | AirportsError> {
    return await this.get<AirportsResponse>(`/port/code/${airportCode}`);
  }

  public static isNotFound(
    response: AirportsResponse | AirportsError
  ): response is AirportsError {
    return "status" in response;
  }

  private static async get<T = any>(path: string): Promise<T> {
    console.log("Fetching ", this.joinPaths(this.url, path));

    const response = await fetch(this.joinPaths(this.url, path));

    return await response.json();
  }

  private static joinPaths(base: string, path: string): string {
    return `${base}${path.startsWith("/") ? path : `/${path}`}`;
  }
}
