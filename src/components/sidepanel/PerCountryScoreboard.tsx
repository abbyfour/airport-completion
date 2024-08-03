"use client";

import { Scoreboard } from "@/database/db";
import { UserProperties } from "@/database/entities/user";
import { InternalClient } from "@/external/internalClient";
import { useEffect, useState } from "react";

type PerCountryScoreboardProps = {
  currentUser?: UserProperties;
  fingerprint: number;
};

export function PerCountryScoreboard({
  currentUser,
  fingerprint,
}: PerCountryScoreboardProps) {
  const [scoreboard, setScoreboard] = useState<Scoreboard | undefined>();
  useEffect(() => {
    InternalClient.scoreboardPerCountry().then((scoreboard) => {
      setScoreboard(scoreboard);
    });
  }, [fingerprint]);

  return (
    <div className="grid grid-cols-3 justify-between w-full [&>*:nth-child(6n+4)]:bg-red-50 [&>*:nth-child(6n+5)]:bg-red-50 [&>*:nth-child(6n+6)]:bg-red-50">
      <div className="font-semibold">Rank</div>
      <div className="font-semibold">Username</div>
      <div className="font-semibold">Countries</div>
      {scoreboard?.map((score, index) => (
        <>
          <div>{index + 1}</div>
          <div
            className={
              score.username === currentUser?.username ? "font-bold" : ""
            }
          >
            {score.username}
          </div>
          <div>{score.count}</div>
        </>
      ))}
    </div>
  );
}
