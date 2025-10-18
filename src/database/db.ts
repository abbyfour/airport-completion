import Database, { RunResult } from "better-sqlite3";
import {
  Airport,
  AirportProperties,
  AirportWithUsers,
} from "./entities/airport";
import { User, UserProperties } from "./entities/user";
import { UserAirport } from "./entities/UserAirport";
import { UserDetailsModule } from "./UserDetailsModule";

export class DB {
  public readonly db: Database.Database;
  public readonly userDetails: UserDetailsModule;

  private static instance: DB;
  private constructor() {
    const db = new Database("completion.db", {});
    db.pragma("journal_mode = WAL");

    this.db = db;
    this.userDetails = new UserDetailsModule(this.db);
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
      "INSERT INTO airports (name, code, country, latitude, longitude) VALUES (?, ?, ?, ?, ?)"
    );

    const info = stmt.run(
      properties.name,
      properties.code,
      properties.country,
      properties.latitude,
      properties.longitude
    ) as RunResult;

    return new Airport(
      properties.name,
      properties.code,
      properties.country,
      properties.latitude,
      properties.longitude,
      parseInt(info.lastInsertRowid.toString())
    );
  }

  public fetchOrCreateAirport(properties: AirportProperties): Airport {
    const stmt = this.db.prepare("SELECT * FROM airports WHERE code = ?");
    const airport = stmt.get(properties.code) as AirportProperties | undefined;

    return airport
      ? new Airport(
          airport.name,
          airport.code,
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
        code: result.code,
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
      "SELECT users.username, users.id as userId, COUNT(user_airports.airport_id) as count FROM users JOIN user_airports ON users.id = user_airports.user_id GROUP BY users.id ORDER BY count DESC"
    );

    return stmt.all() as Scoreboard;
  }

  public async byCountryScoreboard(): Promise<Scoreboard> {
    const stmt = this.db.prepare(
      `SELECT username, userId, COUNT(*) as count 
       FROM (
         SELECT users.username, users.id as userId, airports.country 
         FROM users 
         JOIN user_airports ON users.id = user_airports.user_id 
         JOIN airports ON user_airports.airport_id = airports.id 
         GROUP BY users.username, users.id, airports.country
       ) as user_countries 
       GROUP BY username, userId
       ORDER BY count DESC`
    );

    return stmt.all() as Scoreboard;
  }

  public async mostUniqueScoreboard(): Promise<Scoreboard> {
    const stmt = this.db.prepare(`
      SELECT u.username, u.id AS userId, COUNT(ua.airport_id) AS count
      FROM users u
      LEFT JOIN user_airports ua
      ON u.id = ua.user_id
      AND ua.airport_id IN (
        SELECT airport_id
        FROM user_airports
        GROUP BY airport_id
        HAVING COUNT(user_id) = 1
      )
      GROUP BY u.id
      ORDER BY count DESC
    `);
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

export type Scoreboard = { username: string; userId: number; count: number }[];
export type CountryScoreboard = { country: string; count: number }[];
export type MostUniqueScoreboard = {
  username: string;
  userId: number;
  uniqueCount: number;
}[];
