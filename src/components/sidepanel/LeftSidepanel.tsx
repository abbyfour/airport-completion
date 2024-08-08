import { UserProperties } from "@/database/entities/user";
import { AirportLookup, OnNewAirport } from "../AirportLookup";
import { UserPanel } from "./UserPanel";

type SidepanelProps = {
  lookupDisabled: boolean;
  onNewAirport: OnNewAirport;
  selectedUser: UserProperties | undefined;
  setHighlightedAirportCodes: (codes: string[]) => void;
  fingerprint: number;
};

export function LeftSidepanel({
  lookupDisabled,
  onNewAirport,
  selectedUser,
  setHighlightedAirportCodes,
  fingerprint,
}: SidepanelProps) {
  return (
    <div className="flex flex-col top-[90px] left-0 absolute items-start">
      <AirportLookup disabled={lookupDisabled} onNewAirport={onNewAirport} />

      <UserPanel
        setHighlightedAirportCodes={setHighlightedAirportCodes}
        selectedUser={selectedUser}
        fingerprint={fingerprint}
      />
    </div>
  );
}
