import { InternalClient } from "@/apiClients/internalClient";
import { User } from "@/database/entities/user";
import { useState } from "react";
import { UserDisplay } from "./UserDisplay";

type LoginSignupProps = {
  onLogin: (user: User | undefined) => void;
  user: User | undefined;
  className?: string;
};

export function LoginSignup({ onLogin, user, className }: LoginSignupProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);

  const login = async () => {
    const user = await InternalClient.attemptLogin(username, password);

    if (!InternalClient.isError(user)) {
      onLogin(new User(user.username, user.password, user.id));
      setError(undefined);
    } else {
      setError(user.error);
    }
  };

  const signup = async () => {
    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    const user = await InternalClient.signup({ username, password });

    if (!InternalClient.isError(user)) {
      onLogin(new User(user.username, user.password, user.id));
      setError(undefined);
    } else {
      setError(user.error);
    }
  };

  const logout = () => {
    onLogin(undefined);
  };

  return (
    <div
      className={
        className +
        " p-1 z-[401] flex flex-col gap-2 text-white bg-zinc-900 rounded"
      }
    >
      {error && (
        <div className="p-2 bg-red-200 rounded-lg">
          <p>{error}</p>
        </div>
      )}

      {!user && (
        <div className="flex flex-col gap-2">
          <label htmlFor="username">Username</label>
          <input
            className="bg-zinc-950 border-zinc-700"
            type="text"
            name="username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            className="bg-zinc-950 border-zinc-700"
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="bg-zinc-700 border-zinc-950 hover:bg-highlight"
            onClick={login}
          >
            Log In
          </button>
          <button
            className="bg-zinc-700 border-zinc-950 hover:bg-highlight"
            onClick={signup}
          >
            Sign Up
          </button>
        </div>
      )}

      {user && <UserDisplay user={user} logout={logout} />}
    </div>
  );
}
