"use client";

import { CountryScoreboard as CountryScoreboardType } from "@/database/db";

type CountryScoreboardProps = {
  scoreboard?: CountryScoreboardType;
};

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

export function CountryScoreboard({ scoreboard }: CountryScoreboardProps) {
  return (
    <div className="grid grid-cols-3 justify-between w-full [&>*:nth-child(6n+4)]:bg-red-50 [&>*:nth-child(6n+5)]:bg-red-50 [&>*:nth-child(6n+6)]:bg-red-50">
      <div className="font-semibold">Rank</div>
      <div className="font-semibold">Country</div>
      <div className="font-semibold">Airports</div>
      {scoreboard?.map((score, index) => (
        <>
          <div>{index + 1}</div>
          <div>{regionNames.of(score.country)}</div>
          <div>{score.count}</div>
        </>
      ))}
    </div>
  );
}
