import { Database } from "better-sqlite3";
import { AirportProperties } from "./entities/airport";
import { UserProperties } from "./entities/user";

export interface UserDetails {
  id: number;
  username: string;

  stats: {
    airports: AirportProperties[];
    totalAirports: number;
    totalCountries: number;
    uniqueAirports: number;
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

    return {
      airports,
      totalAirports,
      totalCountries,
      uniqueAirports,
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

  private fetchUserUniqueAirports(id: number): number {
    const stmt = this.db.prepare(
      `
      SELECT COUNT(ua1.airport_id) as uniqueAirports
      FROM user_airports ua1
      WHERE ua1.user_id = ?
      AND ua1.airport_id NOT IN (
          SELECT ua2.airport_id
          FROM user_airports ua2
          WHERE ua2.user_id != ?
      )`
    );

    return (stmt.get(id, id) as { uniqueAirports: number }).uniqueAirports;
  }
}
