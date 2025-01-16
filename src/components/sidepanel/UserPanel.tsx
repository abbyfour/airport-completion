import { InternalClient } from "@/apiClients/internalClient";
import { UserProperties } from "@/database/entities/user";
import { UserDetails } from "@/database/UserDetailsModule";
import { useEffect, useState } from "react";

type UserPanelProps = {
  selectedUser: UserProperties | undefined;
  setHighlightedAirportCodes: (codes: string[]) => void;
  fingerprint: number;
};

export function UserPanel({
  selectedUser,
  setHighlightedAirportCodes,
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
      setHighlightedAirportCodes(
        selectedUserDetails.stats.airports.map((airport) => airport.code)
      );
    } else {
      setHighlightedAirportCodes([]);
    }
  }, [selectedUserDetails]);

  if (!selectedUserDetails) {
    return <></>;
  }

  return (
    <div className="z-[500] bg-white p-3 rounded ml-5 mb-2 w-full max-w-[25vw] flex justify-between">
      <div>
        <h1>
          <span className="font-bold">{selectedUserDetails.username}</span>{" "}
          <span className="text-red-500 text-sm">
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
                ...of which are unique to them:
              </span>{" "}
              {selectedUserDetails.stats.uniqueAirports}
            </p>
            <p>
              <span className="font-medium">Countries visited:</span>{" "}
              {selectedUserDetails.stats.totalCountries}
            </p>
          </div>

          <div>
            <div className="ml-5 text-xs text-red-950 grid grid-cols-[min-content_1fr] gap-x-3 max-h-[60vh] overflow-scroll">
              {selectedUserDetails.stats.airports.map((airport) => (
                <>
                  <p className="text-red-500">{airport.code}</p>
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
        className="text-red-500 font-bold hover:cursor-pointer"
      >
        x
      </span>
    </div>
  );
}
