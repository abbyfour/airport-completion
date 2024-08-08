"use client";

import { APIAirport } from "@/external/APIAirport";
import { AirportLookupAPI } from "@/external/airports";
import { useRef, useState } from "react";

type AirportLookupProps = {
  onNewAirport: (airport: APIAirport) => void;
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
      const airports = await AirportLookupAPI.fetchAirport(code);

      if (!AirportLookupAPI.isNotFound(airports)) {
        airportCodeInput.current!.value = "";
        setError(undefined);
        const airport = new APIAirport(airports.features[0]);

        onSubmittedAirport(airport);
      } else {
        setError(airports.message);
      }

      setLoading(false);
    }
  }

  return (
    <div className="absolute top-10 left-[100px] z-[500] bg-white p-3 rounded w-1/5">
      <form onSubmit={lookupAirport} className="flex flex-col gap-2">
        <label htmlFor="airportCode" className="mr-3">
          Enter an airport you've been to...
        </label>
        <input
          type="text"
          name="airport"
          id="airportCode"
          ref={airportCodeInput}
          disabled={loading || disabled}
          placeholder="IATA/ICAO code"
        />
      </form>

      {error && (
        <div className="p-2 mt-2 bg-red-100 rounded-lg">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
