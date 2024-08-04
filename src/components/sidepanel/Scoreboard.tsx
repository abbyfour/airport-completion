"use client";

import {
  CountryScoreboard as CountryScoreboardType,
  Scoreboard as ScoreboardType,
} from "@/database/db";
import { User } from "@/database/entities/user";
import { InternalClient } from "@/external/internalClient";
import { useEffect, useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { ByCountryScoreboard } from "./ByCountryScoreboard";
import { CountryScoreboard } from "./CountryScoreboard";
import { DefaultScoreboard } from "./DefaultScoreboard";

export function Scoreboard({
  currentUser,
  fingerprint,
  className,
}: {
  currentUser?: User;
  fingerprint: number;
  className?: string;
}) {
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
        " py-3 pr-0 z-[401] mt-2 bg-white rounded flex items-center" +
        (!hidden ? " w-2/6 min-w-[500px]" : "")
      }
    >
      <p
        className="transform rotate-[270deg] mr-2 text-sm hover:underline hover:cursor-pointer m-2"
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
}: {
  scoreboard?: ScoreboardType;
  fingerprint: number;
  selectedTab: string;
  currentUser?: User;
  onSelect: (number: number) => void;
}) {
  const [scoreboard, setScoreboard] = useState<ScoreboardType | undefined>(
    undefined
  );
  const [countryScoreboard, setCountryScoreboard] = useState<
    CountryScoreboardType | undefined
  >(undefined);
  const [byCountryScoreboard, setByCountryScoreboard] = useState<
    ScoreboardType | undefined
  >(undefined);

  useEffect(() => {
    InternalClient.countryScoreboard().then((scoreboard) => {
      setCountryScoreboard(scoreboard);
    });

    InternalClient.scoreboard().then((scoreboard) => {
      setScoreboard(scoreboard);
    });
    InternalClient.scoreboardByCountry().then((scoreboard) => {
      setByCountryScoreboard(scoreboard);
    });
  }, [fingerprint]);

  return (
    <div className={"ml-2 w-full"}>
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
            <h1>Top Countries</h1>
          </Tab>

          <span className="font-semibold">|</span>

          <Tab className="hover:underline">
            <h1>Top by Country</h1>
          </Tab>
        </TabList>

        <TabPanel>
          <DefaultScoreboard
            scoreboard={scoreboard}
            currentUser={currentUser}
          />
        </TabPanel>

        <TabPanel>
          <CountryScoreboard scoreboard={countryScoreboard} />
        </TabPanel>

        <TabPanel>
          <ByCountryScoreboard
            scoreboard={byCountryScoreboard}
            currentUser={currentUser}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
}
