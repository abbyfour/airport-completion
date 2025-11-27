"use client";

import { User } from "@/database/entities/user";
import { useEffect, useState } from "react";
import { CompletionMap } from "./CompletionMap";
import { Footer } from "./sidepanel/Footer";

export function App() {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [fingerprint, setFingerprint] = useState(0);

  const onLogin = (user: User | undefined) => {
    setUser(user);

    if (user) {
      localStorage.setItem("user", JSON.stringify(user.asProperties()));
    } else {
      localStorage.removeItem("user");
    }
  };

  useEffect(() => {
    const storageUser = localStorage.getItem("user");

    if (storageUser && !user) {
      setUser(User.fromProperties(JSON.parse(storageUser)));
    }
  }, []);

  return (
    <div className="font-sans">
      <CompletionMap
        currentUser={user}
        fingerprint={fingerprint}
        setFingerprint={setFingerprint}
        onLogin={onLogin}
      />

      <Footer />
    </div>
  );
}
