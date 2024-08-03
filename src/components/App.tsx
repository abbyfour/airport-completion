"use client";

import { User } from "@/database/entities/user";
import { useEffect, useState } from "react";
import { CompletionMap } from "./CompletionMap";
import { LoginSignup } from "./user/LoginSignup";

export function App() {
  const [user, setUser] = useState<User | undefined>(undefined);

  const onLogin = (user: User) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user.asProperties()));
  };

  useEffect(() => {
    const storageUser = localStorage.getItem("user");

    if (storageUser && !user) {
      setUser(User.fromProperties(JSON.parse(storageUser)));
    }
  }, []);

  return (
    <div>
      <CompletionMap user={user} />

      <LoginSignup onLogin={onLogin} user={user} />
    </div>
  );
}
