import { AirportProperties } from "@/database/entities/airport";
import { LatLng } from "leaflet";
import { RawAirport } from "./airports.types";

export class APIAirport {
  constructor(protected properties: RawAirport) {}

  get id(): number {
    return this.properties.properties.id;
  }

  get position(): LatLng {
    return new LatLng(
      this.properties.geometry.coordinates[1],
      this.properties.geometry.coordinates[0]
    );
  }

  get name(): string {
    return this.properties.properties.name;
  }

  get code(): string {
    // Local code sometimes contains the ICAO code, which is good enough for our use case
    return (
      this.properties.properties.iata ||
      this.properties.properties.local_code ||
      ""
    );
  }

  get countryCode(): string {
    return this.properties.properties.country.code;
  }

  get regionCode(): string {
    return this.properties.properties.region.code;
  }

  public asDBProperties(): AirportProperties {
    return {
      id: this.id,
      code: this.code,
      name: this.name,
      country: this.countryCode,
      latitude: this.position.lat,
      longitude: this.position.lng,
    };
  }
}

export function toLatLng<T extends { latitude: number; longitude: number }>(
  obj: T
): LatLng {
  return new LatLng(obj.latitude, obj.longitude);
}
