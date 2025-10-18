"use client";

import { InternalClient } from "@/apiClients/internalClient";
import { AirportProperties } from "@/database/entities/airport";
import { useRef, useState } from "react";

export type OnNewAirport = (airport: AirportProperties) => void;

type AirportLookupProps = {
  onNewAirport: OnNewAirport;
  disabled?: boolean;
};

export function AirportLookup({
  onNewAirport: onSubmittedAirport,
  disabled = false,
}: AirportLookupProps) {
  const airportCodeInput = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  async function lookupAirport(event: React.FormEvent) {
    event?.preventDefault();

    const code = airportCodeInput.current?.value;

    if (code) {
      setLoading(true);
      const response = await InternalClient.lookupAirportByCode(code);

      if (response && "airport" in response) {
        airportCodeInput.current!.value = "";
        setError(undefined);

        onSubmittedAirport(response.airport);
      } else {
        setError("Couldn't find an airport with that code.");
      }

      setLoading(false);
    }
  }

  return (
    <div className="z-[500] text-white bg-zinc-900 p-3 rounded ml-5 mb-2 w-full">
      <form onSubmit={lookupAirport} className="flex flex-col gap-2">
        <label htmlFor="airportCode" className="mr-3">
          Enter an airport you've been to...
        </label>
        <input
          className="text-white bg-zinc-950 border-zinc-700 p-1"
          type="text"
          name="airport"
          id="airportCode"
          ref={airportCodeInput}
          disabled={loading || disabled}
          placeholder="IATA/ICAO code"
        />
      </form>

      {error && (
        <div className="p-2 mt-2 bg-zinc-950 text-unique rounded-lg">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
