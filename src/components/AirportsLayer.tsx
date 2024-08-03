import { AirportWithUsers } from "@/database/entities/airport";
import { UserProperties } from "@/database/entities/user";
import { LayerGroup } from "react-leaflet";
import { AirportMarker } from "./AirportMarker";

type AirportsLayerProps = {
  airports: Array<AirportWithUsers>;
  onDeregister: (airportId: number) => void;
  currentUser?: UserProperties;
};

export function AirportsLayer({
  airports,
  onDeregister,
  currentUser,
}: AirportsLayerProps) {
  return (
    <LayerGroup>
      {airports.map((airport) => (
        <AirportMarker
          key={airport.airport.id}
          airport={airport}
          onDeregister={onDeregister}
          currentUser={currentUser}
        />
      ))}
    </LayerGroup>
  );
}
