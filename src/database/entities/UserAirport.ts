export class UserAirport {
  public static readonly schema = [
    `CREATE TABLE IF NOT EXISTS user_airports (
        id INTEGER PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) NOT NULL,
        airport_id INTEGER REFERENCES airports(id) NOT NULL
      );`,
    `CREATE UNIQUE INDEX IF NOT EXISTS user_id_airport_id ON user_airports(user_id, airport_id);`,
  ];

  public id: number;
  public user_id: number;
  public airport_id: number;

  constructor(user_id: number, airport_id: number, id?: number) {
    this.user_id = user_id;
    this.airport_id = airport_id;
    this.id = id!;
  }
}
