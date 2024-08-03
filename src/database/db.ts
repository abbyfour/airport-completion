import Database, { RunResult } from "better-sqlite3";
import {
  Airport,
  AirportProperties,
  AirportWithUsers,
} from "./entities/airport";
import { User, UserProperties } from "./entities/user";
import { UserAirport } from "./entities/UserAirport";

export class DB {
  public readonly db: Database.Database;

  private static instance: DB;
  private constructor() {
    const db = new Database("completion.db", {});
    db.pragma("journal_mode = WAL");

    this.db = db;
    this.createTables();
  }

  static getInstance() {
    if (!DB.instance) {
      DB.instance = new DB();
    }
    return DB.instance;
  }

  public attemptLogin(username: string, password: string): User | undefined {
    const user = this.fetchUser(username);

    if (user && user.password === password) {
      return user;
    }
  }

  public fetchUser(username: string): User | undefined {
    const stmt = this.db.prepare("SELECT * FROM users WHERE username = ?");
    const user = stmt.get(username) as UserProperties | undefined;
    return user ? new User(user.username, user.password, user.id) : undefined;
  }

  public createUser(properties: Omit<UserProperties, "id">): User {
    const stmt = this.db.prepare(
      "INSERT INTO users (username, password) VALUES (?, ?)"
    );
    const info = stmt.run(
      properties.username,
      properties.password
    ) as RunResult;

    return new User(
      properties.username,
      properties.password,
      parseInt(info.lastInsertRowid.toString())
    );
  }

  public registerAirportForUser(userId: number, airportId: number) {
    const stmt = this.db.prepare(
      "INSERT INTO user_airports (user_id, airport_id) VALUES (?, ?)"
    );

    stmt.run(userId, airportId);
  }

  public deregisterAirport(userId: number, airportId: number) {
    const stmt = this.db.prepare(
      "DELETE FROM user_airports WHERE user_id = ? AND airport_id = ?"
    );

    stmt.run(userId, airportId);
  }

  public createAirport(properties: AirportProperties): Airport {
    const stmt = this.db.prepare(
      "INSERT INTO airports (name, iata_code, country, latitude, longitude) VALUES (?, ?, ?, ?, ?)"
    );

    const info = stmt.run(
      properties.name,
      properties.iata_code,
      properties.country,
      properties.latitude,
      properties.longitude
    ) as RunResult;

    return new Airport(
      properties.name,
      properties.iata_code,
      properties.country,
      properties.latitude,
      properties.longitude,
      parseInt(info.lastInsertRowid.toString())
    );
  }

  public fetchOrCreateAirport(properties: AirportProperties): Airport {
    const stmt = this.db.prepare("SELECT * FROM airports WHERE iata_code = ?");
    const airport = stmt.get(properties.iata_code) as
      | AirportProperties
      | undefined;

    return airport
      ? new Airport(
          airport.name,
          airport.iata_code,
          airport.country,
          airport.latitude,
          airport.longitude,
          airport.id
        )
      : this.createAirport(properties);
  }

  public fetchAllAirportsWithUsers(): AirportWithUsers[] {
    const stmt = this.db.prepare(
      "SELECT airports.*, users.username, users.id as user_id FROM airports JOIN user_airports ON airports.id = user_airports.airport_id JOIN users ON user_airports.user_id = users.id"
    );

    const results = stmt.all() as (AirportProperties & {
      username: string;
      user_id: number;
    })[];

    const airports: AirportWithUsers[] = [];

    results.forEach((result) => {
      const airport: AirportProperties = {
        id: result.id,
        name: result.name,
        iata_code: result.iata_code,
        country: result.country,
        latitude: result.latitude,
        longitude: result.longitude,
      };

      const user: UserProperties = {
        username: result.username,
        id: result.user_id,
        password: "",
      };

      const existing = airports.find((a) => a.airport.id === airport.id);

      if (existing) {
        existing.users.push(user);
      } else {
        airports.push({
          airport,
          users: [user],
        });
      }
    });

    return airports.filter((airport) => airport.users.length > 0);
  }

  public async scoreboard(): Promise<Scoreboard> {
    const stmt = this.db.prepare(
      "SELECT users.username, COUNT(user_airports.airport_id) as count FROM users JOIN user_airports ON users.id = user_airports.user_id GROUP BY users.id ORDER BY count DESC"
    );

    return stmt.all() as Scoreboard;
  }

  private createTables() {
    const users = this.db.prepare(User.schema);
    users.run();

    const airports = this.db.prepare(Airport.schema);
    airports.run();

    UserAirport.schema.forEach((stmt) => {
      this.db.prepare(stmt).run();
    });
  }
}

export type Scoreboard = { username: string; count: number }[];
