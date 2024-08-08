"use client";

import { Scoreboard } from "@/database/db";
import { UserProperties } from "@/database/entities/user";
import { SetSelectedUser } from "../CompletionMap";

type DefaultScoreboardProps = {
  currentUser?: UserProperties;
  scoreboard?: Scoreboard;
  setSelectedUser: SetSelectedUser;
};

export function DefaultScoreboard({
  currentUser,
  scoreboard,
  setSelectedUser,
}: DefaultScoreboardProps) {
  return (
    <div className="grid grid-cols-3 justify-between w-full [&>*:nth-child(6n+4)]:bg-red-50 [&>*:nth-child(6n+5)]:bg-red-50 [&>*:nth-child(6n+6)]:bg-red-50">
      <div className="font-semibold">Rank</div>
      <div className="font-semibold">Username</div>
      <div className="font-semibold">Airports</div>
      {scoreboard?.map((score, index) => (
        <>
          <div>{index + 1}</div>
          <div
            onClick={() =>
              setSelectedUser({
                id: score.userId,
                username: score.username,
                password: "",
              })
            }
            className={
              "hover:cursor-pointer hover:underline" +
              (score.username === currentUser?.username ? " font-bold" : "")
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
