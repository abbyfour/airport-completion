import { User } from "@/database/entities/user";
import { InternalClient } from "@/external/internalClient";
import { useState } from "react";
import { UserDisplay } from "./UserDisplay";

type LoginSignupProps = {
  onLogin: (user: User) => void;
  user: User | undefined;
};

export function LoginSignup({ onLogin, user }: LoginSignupProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);

  const login = async () => {
    const user = await InternalClient.attemptLogin(username, password);

    if (!InternalClient.isError(user)) {
      onLogin(new User(user.username, user.password, user.id));
    } else {
      setError(user.error);
    }
  };

  const signup = async () => {
    const user = await InternalClient.signup({ username, password });

    if (!InternalClient.isError(user)) {
      onLogin(new User(user.username, user.password, user.id));
    } else {
      setError(user.error);
    }
  };

  return (
    <div className="p-1 absolute right-5 top-10 z-[401] flex flex-col gap-2 bg-white rounded">
      {error && (
        <div className="p-2 bg-red-200 rounded-lg">
          <p>{error}</p>
        </div>
      )}

      {!user && (
        <div className="flex flex-col">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={login}>Log In</button>
          <button onClick={signup}>Sign Up</button>
        </div>
      )}

      {user && <UserDisplay user={user} />}
    </div>
  );
}
