"use client";

import { Scoreboard as ScoreboardType } from "@/database/db";
import { User } from "@/database/entities/user";
import { InternalClient } from "@/external/internalClient";
import { useEffect, useState } from "react";

export function Scoreboard({
  currentUser,
  fingerprint,
}: {
  currentUser?: User;
  fingerprint: number;
}) {
  const [scoreboard, setScoreboard] = useState<ScoreboardType | undefined>();
  const [hidden, setHidden] = useState(
    localStorage.getItem("scoreboard") === "hidden"
  );

  function toggle() {
    setHidden(!hidden);
    localStorage.setItem("scoreboard", hidden ? "visible" : "hidden");
  }

  useEffect(() => {
    InternalClient.scoreboard().then((scoreboard) => {
      setScoreboard(scoreboard);
    });
  }, [fingerprint]);

  return (
    <div className="py-3 pr-0 z-[401] absolute right-5 top-auto mt-2 bg-white rounded max-w-[30%] flex items-center">
      <p
        className="transform rotate-[270deg] mr-2 text-sm hover:underline hover:cursor-pointer m-2"
        onClick={toggle}
      >
        {hidden ? "Show" : "Hide"}
      </p>
      <div className={hidden ? "hidden" : ""}>
        <h1>Scoreboard</h1>

        <table className="">
          <thead>
            <tr className="*:pr-4">
              <th>Rank</th>
              <th>Username</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {scoreboard?.map((score, index) => (
              <tr key={score.username}>
                <td>{index + 1}</td>
                <td
                  className={
                    score.username === currentUser?.username ? "font-bold" : ""
                  }
                >
                  {score.username}
                </td>
                <td>{score.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
