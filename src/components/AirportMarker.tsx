import {
  AirplaneIcon,
  DisselectedAirplaneIcon,
  HighlightedAirplaneIcon,
  HighlightedDisusedAirplaneIcon,
  HighlightedEternalAirplaneIcon,
  HighlightedUniqueAirplaneIcon,
} from "@/assets/AirplaneIcon";
import { AirportWithUsers } from "@/database/entities/airport";
import { UserProperties } from "@/database/entities/user";
import { LatLng } from "leaflet";
import { Marker, Popup, Tooltip } from "react-leaflet";

export type AirportMarkerProps = {
  airport: AirportWithUsers;
  currentUser: UserProperties | undefined;
  onDeregister: (airportId: number) => void;
  highlighted?: boolean | "unique" | "disused" | "eternal";
  otherAirportsHighlighted?: boolean;
};

export function toLatLng<T extends { latitude: number; longitude: number }>(
  obj: T
): LatLng {
  return new LatLng(obj.latitude, obj.longitude);
}

export function AirportMarker({
  airport,
  currentUser,
  onDeregister,
  highlighted,
  otherAirportsHighlighted,
}: AirportMarkerProps) {
  return (
    <Marker
      zIndexOffset={highlighted ? 1000 : 0}
      position={toLatLng(airport.airport)}
      icon={getIcon(highlighted, otherAirportsHighlighted)}
    >
      <Popup className="text-red-950">
        <h3 className="text-lg m-0">
          <span
            className={
              "text-base mr-2 " +
              (airport.airport.is_disused ? "text-closed" : "text-highlight")
            }
          >
            {airport.airport.code}
          </span>
          {airport.airport.name}{" "}
          {airport.airport.is_disused ? (
            <span className="text-sm text-closed m-0">(closed)</span>
          ) : (
            <> </>
          )}
        </h3>

        <div>
          <p>Users that have visited this airport:</p>
          <ul>
            {airport.users.map((user) => (
              <li key={user.id}>
                {user.username}{" "}
                {currentUser?.id === user.id ? (
                  <span
                    onClick={() => onDeregister(airport.airport.id)}
                    className="hover:cursor-pointer text-highlight"
                  >
                    x
                  </span>
                ) : (
                  <> </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </Popup>
      <Tooltip>{airport.airport.code}</Tooltip>
    </Marker>
  );
}

function getIcon(
  highlighted: AirportMarkerProps["highlighted"],
  otherAirportsHighlighted: AirportMarkerProps["otherAirportsHighlighted"]
): L.Icon {
  switch (highlighted) {
    case true:
      return HighlightedAirplaneIcon;
    case "unique":
      return HighlightedUniqueAirplaneIcon;
    case "disused":
      return HighlightedDisusedAirplaneIcon;
    case "eternal":
      return HighlightedEternalAirplaneIcon;
    case false:
    case undefined:
      return otherAirportsHighlighted ? DisselectedAirplaneIcon : AirplaneIcon;
  }
}
