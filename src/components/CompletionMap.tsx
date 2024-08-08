"use client";

import { AirportWithUsers } from "@/database/entities/airport";
import { User, UserProperties } from "@/database/entities/user";
import { APIAirport } from "@/external/APIAirport";
import { InternalClient } from "@/external/internalClient";
import { LatLngTuple } from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { AirportsLayer } from "./AirportsLayer";
import { CountriesLayer } from "./CountriesLayer";
import { LeftSidepanel } from "./sidepanel/LeftSidepanel";
import { RightSidepanel } from "./sidepanel/RightSidepanel";

export type SetSelectedUser = (user: UserProperties | undefined) => void;

type CompletionMapProps = {
  user?: User;
  setFingerprint: (fingerprint: number) => void;
  fingerprint: number;
  onLogin: (user: User) => void;
};

export function CompletionMap({
  user,
  setFingerprint,
  fingerprint,
  onLogin,
}: CompletionMapProps) {
  const mapPosition: LatLngTuple = [49.193901062, -123.183998108];

  const [airports, setAirports] = useState<Array<AirportWithUsers>>([]);
  const [doneLoading, setDoneLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProperties | undefined>(
    undefined
  );
  const [highlightedAirportCodes, setHighlightedAirportCodes] = useState<
    string[]
  >([]);

  function fetchAirports() {
    InternalClient.fetchAirports().then((response) => {
      setFingerprint(InternalClient.generateFingerprint(fingerprint));
      if (InternalClient.isError(response)) {
        console.error(response.error);
      } else {
        setAirports(response);
      }
      setDoneLoading(true);
    });
  }

  useEffect(() => {
    fetchAirports();
  }, []);

  const registerAirport = async (airport: APIAirport) => {
    const response = InternalClient.registerAirport(
      user!.id,
      airport.asDBProperties()
    );

    if (InternalClient.isError(response)) {
      console.error(response.error);
    } else {
      setDoneLoading(false);
      fetchAirports();
    }
  };

  const deregister = (airportId: number) => {
    InternalClient.deregisterAirport(user!.id, airportId);

    setAirports(
      airports
        .map((a) => {
          if (a.airport.id === airportId) {
            return {
              ...a,
              users: a.users.filter((u) => u.id !== user!.id),
            } as AirportWithUsers;
          } else return a;
        })
        .filter((a) => a.users.length > 0)
    );
  };

  return (
    <div>
      <MapContainer
        center={mapPosition}
        zoom={3}
        scrollWheelZoom={true}
        className="w-screen h-screen absolute top-0 left-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <AirportsLayer
          airports={airports}
          onDeregister={deregister}
          highlightedAirportCodes={highlightedAirportCodes}
        />
        <CountriesLayer countryCodes={airports.map((a) => a.airport.country)} />
      </MapContainer>

      <LeftSidepanel
        lookupDisabled={!user || !doneLoading}
        onNewAirport={registerAirport}
        selectedUser={selectedUser}
        setHighlightedAirportCodes={setHighlightedAirportCodes}
        fingerprint={fingerprint}
      />

      <RightSidepanel
        onLogin={onLogin}
        user={user}
        fingerprint={fingerprint}
        setSelectedUser={setSelectedUser}
      />
    </div>
  );
}
