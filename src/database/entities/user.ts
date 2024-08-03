export interface UserProperties {
  id: number;
  username: string;
  password: string;
}

export class User {
  public static readonly schema = `
    CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL
        )
  `;

  public id: number;
  public username: string;
  public password: string;

  constructor(username: string, password: string, id: number) {
    this.username = username;
    this.password = password;
    this.id = id;
  }

  public asProperties(): UserProperties {
    return {
      id: this.id,
      username: this.username,
      password: this.password,
    };
  }

  public static fromProperties(properties: UserProperties) {
    return new User(properties.username, properties.password, properties.id);
  }
}
