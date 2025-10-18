"use client";

import { InternalClient } from "@/apiClients/internalClient";
import { Scoreboard as ScoreboardType } from "@/database/db";
import { User } from "@/database/entities/user";
import { useEffect, useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { SetSelectedUser } from "../CompletionMap";
import { ByCountryScoreboard } from "./ByCountryScoreboard";
import { DefaultScoreboard } from "./DefaultScoreboard";

type ScoreboardProps = {
  currentUser?: User;
  fingerprint: number;
  className?: string;
  setSelectedUser: SetSelectedUser;
};

export function Scoreboard({
  currentUser,
  fingerprint,
  className,
  setSelectedUser,
}: ScoreboardProps) {
  const [hidden, setHidden] = useState(
    localStorage.getItem("scoreboard") === "hidden"
  );
  const [selectedTab, setSelectedTab] = useState(
    localStorage.getItem("selectedTab") || "0"
  );

  function toggle() {
    setHidden(!hidden);
    localStorage.setItem("scoreboard", hidden ? "visible" : "hidden");
  }

  const onTabSelect = (index: number) => {
    setSelectedTab(index.toString());

    localStorage.setItem("selectedTab", index.toString());
  };

  return (
    <div
      className={
        className +
        " py-3 pr-0 z-[401] mt-2 bg-zinc-900 text-white rounded flex" +
        (!hidden ? " w-2/6 min-w-[500px]" : "")
      }
    >
      <p
        className="transform rotate-[270deg] mr-2 text-sm hover:underline hover:cursor-pointer m-2 self-center"
        onClick={toggle}
      >
        {hidden ? "Show" : "Hide"}
      </p>
      {!hidden && (
        <ScoreboardTabs
          currentUser={currentUser}
          fingerprint={fingerprint}
          selectedTab={selectedTab}
          onSelect={onTabSelect}
          setSelectedUser={setSelectedUser}
        />
      )}
    </div>
  );
}

function ScoreboardTabs({
  fingerprint,
  selectedTab,
  currentUser,
  onSelect,
  setSelectedUser,
}: {
  scoreboard?: ScoreboardType;
  fingerprint: number;
  selectedTab: string;
  currentUser?: User;
  onSelect: (number: number) => void;
  setSelectedUser: SetSelectedUser;
}) {
  const [scoreboard, setScoreboard] = useState<ScoreboardType | undefined>(
    undefined
  );
  const [mostUniqueScoreboard, setMostUniqueScoreboard] = useState<
    ScoreboardType | undefined
  >(undefined);
  const [byCountryScoreboard, setByCountryScoreboard] = useState<
    ScoreboardType | undefined
  >(undefined);

  useEffect(() => {
    InternalClient.mostUniqueScoreboard().then((scoreboard) => {
      setMostUniqueScoreboard(scoreboard);
    });

    InternalClient.scoreboard().then((scoreboard) => {
      setScoreboard(scoreboard);
    });

    InternalClient.scoreboardByCountry().then((scoreboard) => {
      setByCountryScoreboard(scoreboard);
    });
  }, [fingerprint]);

  return (
    <div className="ml-2 w-full overflow-scroll">
      <Tabs
        selectedTabClassName="font-bold"
        onSelect={onSelect}
        selectedIndex={parseInt(selectedTab)}
      >
        <TabList className="flex gap-2 mb-4 *:cursor-pointer">
          <Tab>
            <h1 className="hover:underline">Scoreboard</h1>
          </Tab>

          <span className="font-semibold">|</span>

          <Tab className="hover:underline">
            <h1>Top by Country</h1>
          </Tab>

          <span className="font-semibold">|</span>

          <Tab className="hover:underline">
            <h1>Most Unique</h1>
          </Tab>
        </TabList>

        <TabPanel>
          <DefaultScoreboard
            scoreboard={scoreboard}
            setSelectedUser={setSelectedUser}
            currentUser={currentUser}
          />
        </TabPanel>

        <TabPanel>
          <ByCountryScoreboard
            setSelectedUser={setSelectedUser}
            scoreboard={byCountryScoreboard}
            currentUser={currentUser}
          />
        </TabPanel>

        <TabPanel>
          <DefaultScoreboard
            scoreboard={mostUniqueScoreboard}
            setSelectedUser={setSelectedUser}
            currentUser={currentUser}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
}
