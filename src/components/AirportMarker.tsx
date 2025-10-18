import {
  AirplaneIcon,
  HighlightedAirplaneIcon,
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
  highlighted?: boolean | "unique";
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
}: AirportMarkerProps) {
  return (
    <Marker
      position={toLatLng(airport.airport)}
      icon={
        highlighted
          ? highlighted === "unique"
            ? HighlightedUniqueAirplaneIcon
            : HighlightedAirplaneIcon
          : AirplaneIcon
      }
    >
      <Popup className="text-red-950">
        <h3 className="text-lg m-0">
          <span className="text-highlight text-base mr-2">
            {airport.airport.code}
          </span>
          {airport.airport.name}{" "}
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
