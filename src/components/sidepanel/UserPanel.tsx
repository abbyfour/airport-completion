import { InternalClient } from "@/apiClients/internalClient";
import { UserAirportProperties } from "@/database/entities/airport";
import { UserProperties } from "@/database/entities/user";
import { UserDetails } from "@/database/UserDetailsModule";
import { useEffect, useState } from "react";

type UserPanelProps = {
  selectedUser: UserProperties | undefined;
  setHighlightedAirports: (airports: UserAirportProperties[]) => void;
  fingerprint: number;
};

export function UserPanel({
  selectedUser,
  setHighlightedAirports,
  fingerprint,
}: UserPanelProps) {
  const [selectedUserDetails, setSelectedUserDetails] = useState<
    UserDetails | undefined
  >(undefined);

  useEffect(() => {
    if (selectedUser) {
      InternalClient.userDetails(selectedUser.id).then((response) => {
        if (InternalClient.isError(response)) {
          console.error(response.error);
        } else {
          setSelectedUserDetails(response);
        }
      });
    }
  }, [selectedUser, fingerprint]);

  useEffect(() => {
    if (selectedUserDetails) {
      setHighlightedAirports(selectedUserDetails.stats.airports);
    } else {
      setHighlightedAirports([]);
    }
  }, [selectedUserDetails]);

  if (!selectedUserDetails) {
    return <></>;
  }

  return (
    <div className="z-[500] text-white bg-zinc-900 p-3 rounded ml-5 mb-2 w-full max-w-[25vw] flex justify-between">
      <div>
        <h1>
          <span className="font-bold">{selectedUserDetails.username}</span>{" "}
          <span className="text-highlight text-sm">
            ({selectedUserDetails.id})
          </span>
        </h1>

        <div className="text-sm">
          <div className="mb-1">
            <p>
              <span className="font-medium">Airports visited:</span>{" "}
              {selectedUserDetails.stats.totalAirports}
            </p>
            <p>
              <span className="font-medium italic">
                ...of which are <span className="text-unique">unique </span>
                to them:
              </span>{" "}
              {selectedUserDetails.stats.uniqueAirports}
            </p>
            <p>
              <span className="font-medium">Countries visited:</span>{" "}
              {selectedUserDetails.stats.totalCountries}
            </p>
          </div>

          <div>
            <div className="ml-5 text-xs grid grid-cols-[min-content_1fr] gap-x-3 max-h-[60vh] overflow-scroll">
              {selectedUserDetails.stats.airports.map((airport) => (
                <>
                  <p
                    className={
                      airport.isUnique ? "text-unique" : "text-highlight"
                    }
                  >
                    {airport.code}
                  </p>
                  <p>
                    {airport.name} ({airport.country})
                  </p>
                </>
              ))}
            </div>
          </div>
        </div>
      </div>

      <span
        onClick={() => setSelectedUserDetails(undefined)}
        className="text-highlight font-bold hover:cursor-pointer"
      >
        x
      </span>
    </div>
  );
}
