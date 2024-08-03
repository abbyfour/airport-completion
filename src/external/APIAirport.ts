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

  get iataCode(): string {
    return this.properties.properties.iata || "";
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
      iata_code: this.iataCode,
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
