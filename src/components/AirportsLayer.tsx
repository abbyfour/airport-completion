import {
  AirportWithUsers,
  UserAirportProperties,
} from "@/database/entities/airport";
import { UserProperties } from "@/database/entities/user";
import { LayerGroup } from "react-leaflet";
import { AirportMarker } from "./AirportMarker";

type AirportsLayerProps = {
  airports: Array<AirportWithUsers>;
  onDeregister: (airportId: number) => void;
  highlightedAirports?: UserAirportProperties[];
  currentUser: UserProperties | undefined;
};

export function AirportsLayer({
  airports,
  onDeregister,
  highlightedAirports,
  currentUser,
}: AirportsLayerProps) {
  return (
    <LayerGroup>
      {airports.map((airport) => {
        const highlight = highlightedAirports?.find(
          (a) => a.code === airport.airport.code
        );

        return (
          <AirportMarker
            key={airport.airport.id}
            airport={airport}
            onDeregister={onDeregister}
            highlighted={
              highlight ? (highlight.isUnique ? "unique" : true) : undefined
            }
            currentUser={currentUser}
          />
        );
      })}
    </LayerGroup>
  );
}
