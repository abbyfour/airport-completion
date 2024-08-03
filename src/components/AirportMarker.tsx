import { AirplaneIcon } from "@/assets/AirplaneIcon";
import { AirportWithUsers } from "@/database/entities/airport";
import { UserProperties } from "@/database/entities/user";
import { toLatLng } from "@/external/APIAirport";
import { Marker, Popup } from "react-leaflet";

export type AirportMarkerProps = {
  airport: AirportWithUsers;
  currentUser?: UserProperties;
  onDeregister: (airportId: number) => void;
};

export function AirportMarker({
  airport,
  currentUser,
  onDeregister,
}: AirportMarkerProps) {
  return (
    <Marker position={toLatLng(airport.airport)} icon={AirplaneIcon}>
      <Popup className="text-teal-900">
        <h3 className="text-lg m-0">
          {airport.airport.name}{" "}
          <span className="text-slate-400 text-base">
            {airport.airport.iata_code}
          </span>
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
                    className="hover:cursor-pointer text-red-500"
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
    </Marker>
  );
}
