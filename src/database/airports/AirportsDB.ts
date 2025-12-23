import csvParser from "csv-parser";
import { createReadStream } from "fs";
import { AirportProperties } from "../entities/airport";

interface AirportRow {
  id: string;
  ident: string;
  type: string;
  name: string;
  latitude_deg: string;
  longitude_deg: string;
  elevation_ft: string;
  continent: string;
  iso_country: string;
  iso_region: string;
  municipality: string;
  scheduled_service: string;
  gps_code: string;
  iata_code: string;
  local_code: string;
  home_link: string;
  wikipedia_link: string;
  keywords: string;
}

type ForEachAirportPredicate = (airport: AirportRow) => boolean;

export abstract class AirportsDB {
  static filepath = "src/database/airports/airports.csv";

  private static async findRowByCode(
    code: string,
    codeType: keyof AirportRow
  ): Promise<AirportRow | undefined> {
    return await this.forEachAirport((airport) =>
      compareCodes(code, airport[codeType])
    );
  }

  public static async findAirportByCode(
    code: string
  ): Promise<AirportProperties | undefined> {
    const rawRow =
      (await this.findRowByCode(code, "iata_code")) ||
      (await this.findRowByCode(code, "local_code")) ||
      (await this.findRowByCode(code, "ident"));

    if (!rawRow) return undefined;

    return {
      id: -1,
      code: rawRow.iata_code || rawRow.local_code || rawRow.ident,
      name: rawRow.name,
      country: rawRow.iso_country,
      latitude: parseFloat(rawRow.latitude_deg),
      longitude: parseFloat(rawRow.longitude_deg),
      is_disused: false,
    };
  }

  private static forEachAirport(
    predicate: ForEachAirportPredicate
  ): Promise<AirportRow | undefined> {
    return new Promise((resolve, reject) => {
      const stream = createReadStream(AirportsDB.filepath).pipe(csvParser());

      stream
        .on("data", (row) => {
          if (predicate(row)) {
            resolve(row);
            stream.destroy();
          }
        })
        .on("end", () => resolve(undefined))
        .on("error", reject);
    });
  }
}

function compareCodes(input: string, code: string): boolean {
  return sanitizeCode(input) === sanitizeCode(code);
}

function sanitizeCode(code: string): string {
  return code.trim().toUpperCase();
}
