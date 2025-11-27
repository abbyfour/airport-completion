import { UserAirportProperties } from "@/database/entities/airport";
import { User, UserProperties } from "@/database/entities/user";
import { AirportLookup, OnNewAirport } from "../AirportLookup";
import { SetSelectedUser } from "../CompletionMap";
import { LeftSidepanelContainer } from "../containers/LeftSidepanelContainer";
import { RightSidepanelContainer } from "../containers/RightSidepanelContainer";
import { LoginSignup } from "../user/LoginSignup";
import { Scoreboard } from "./Scoreboard";
import { UserPanel } from "./UserPanel";

type RightSidepanelProps = {
  onLogin: (user: User | undefined) => void;
  user?: User;
  fingerprint: number;
  setSelectedUser: SetSelectedUser;
};

export type LeftSidepanelProps = {
  lookupDisabled: boolean;
  onNewAirport: OnNewAirport;
  selectedUser: UserProperties | undefined;
  setHighlightedAirports: (airports: UserAirportProperties[]) => void;
  fingerprint: number;
};

type SidepanelGroupProps = LeftSidepanelProps & RightSidepanelProps;

export function SidepanelGroup({ ...props }: SidepanelGroupProps) {
  return (
    <div className="sidepanel-group">
      <LeftSidepanelContainer>
        <AirportLookup
          disabled={props.lookupDisabled}
          onNewAirport={props.onNewAirport}
        />

        <UserPanel
          setHighlightedAirports={props.setHighlightedAirports}
          selectedUser={props.selectedUser}
          fingerprint={props.fingerprint}
        />
      </LeftSidepanelContainer>

      <RightSidepanelContainer>
        <h2 className="text-6xl mb-2 font-display text-white top-0 right-0 absolute z-[401] m-5 no-select">
          airports,
        </h2>
        <div className="flex flex-col top-[90px] right-0 absolute items-end">
          <LoginSignup
            onLogin={props.onLogin}
            user={props.user}
            className="w-80 z-[401] mr-5"
          />

          <Scoreboard
            currentUser={props.user}
            fingerprint={props.fingerprint}
            className="z-[401] mr-5 max-h-[70vh]"
            setSelectedUser={props.setSelectedUser}
          />
        </div>
      </RightSidepanelContainer>
    </div>
  );
}
