import { AirportWithUsers } from "@/database/entities/airport";
import { UserProperties } from "@/database/entities/user";
import { LayerGroup } from "react-leaflet";
import { AirportMarker } from "./AirportMarker";

type AirportsLayerProps = {
  airports: Array<AirportWithUsers>;
  onDeregister: (airportId: number) => void;
  highlightedAirportCodes?: string[];
  currentUser: UserProperties | undefined;
};

export function AirportsLayer({
  airports,
  onDeregister,
  highlightedAirportCodes,
  currentUser,
}: AirportsLayerProps) {
  return (
    <LayerGroup>
      {airports.map((airport) => (
        <AirportMarker
          key={airport.airport.id}
          airport={airport}
          onDeregister={onDeregister}
          highlighted={highlightedAirportCodes?.includes(airport.airport.code)}
          currentUser={currentUser}
        />
      ))}
    </LayerGroup>
  );
}
