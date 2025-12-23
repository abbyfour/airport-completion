import { Database } from "better-sqlite3";
import { AirportProperties, UserAirportProperties } from "./entities/airport";
import { UserProperties } from "./entities/user";

export interface UserDetails {
  id: number;
  username: string;

  stats: {
    airports: UserAirportProperties[];
    totalAirports: number;
    totalCountries: number;
    uniqueAirports: number;
    disusedAirports: number;
    eternalAirports: number;
  };
}

export class UserDetailsModule {
  constructor(private readonly db: Database) {}

  public fetchUserDetails(id: number): UserDetails {
    const user = this.fetchUser(id);

    const stats = this.fetchUserStats(id);

    return {
      id: user.id,
      username: user.username,
      stats,
    };
  }

  public fetchUser(id: number): UserProperties {
    const stmt = this.db.prepare("SELECT id, username FROM users WHERE id = ?");
    return stmt.get(id) as UserProperties;
  }

  private fetchUserStats(id: number): UserDetails["stats"] {
    const airports = this.fetchUserAirports(id);
    const { totalAirports, totalCountries } =
      this.fetchUserTotalAirportsAndCountries(id);
    const uniqueAirports = this.fetchUserUniqueAirports(id);

    const preparedAirports = airports.map((airport) => {
      const isUnique = uniqueAirports.some((ua) => ua.id === airport.id);

      return {
        ...airport,
        isUnique,
        isEternal: isUnique && airport.is_disused,
      };
    });

    return {
      airports: preparedAirports,
      totalAirports,
      totalCountries,
      uniqueAirports: uniqueAirports.length,
      disusedAirports: preparedAirports.filter((a) => a.is_disused).length,
      eternalAirports: preparedAirports.filter((a) => a.isEternal).length,
    };
  }

  private fetchUserAirports(id: number): AirportProperties[] {
    const stmt = this.db.prepare(
      "SELECT a.* FROM airports a JOIN user_airports ua ON a.id = ua.airport_id WHERE ua.user_id = ? ORDER BY code ASC"
    );

    return stmt.all(id) as AirportProperties[];
  }

  private fetchUserTotalAirportsAndCountries(id: number): {
    totalAirports: number;
    totalCountries: number;
  } {
    const stmt = this.db.prepare(
      "SELECT COUNT(DISTINCT airports.id) as totalAirports, COUNT(DISTINCT country) as totalCountries FROM user_airports JOIN airports ON airports.id = user_airports.airport_id WHERE user_id = ?"
    );

    return stmt.get(id) as { totalAirports: number; totalCountries: number };
  }

  private fetchUserUniqueAirports(id: number): AirportProperties[] {
    const stmt = this.db.prepare(
      `
      SELECT a.*
      FROM airports a
      JOIN user_airports ua ON a.id = ua.airport_id
      WHERE ua.user_id = ?
      AND a.id NOT IN (
          SELECT airport_id
          FROM user_airports
          WHERE user_id != ?
      )
      `
    );

    return stmt.all(id, id) as AirportProperties[];
  }
}
