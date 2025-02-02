import { User } from "@/database/entities/user";
import { SetSelectedUser } from "../CompletionMap";
import { LoginSignup } from "../user/LoginSignup";
import { Scoreboard } from "./Scoreboard";

type SidepanelProps = {
  onLogin: (user: User) => void;
  user?: User;
  fingerprint: number;
  setSelectedUser: SetSelectedUser;
};

export function RightSidepanel({
  onLogin,
  user,
  fingerprint,
  setSelectedUser,
}: SidepanelProps) {
  return (
    <>
      <h2 className="text-6xl mb-2 font-display font-black italic top-0 right-0 absolute z-[401] m-5 no-select">
        Transit BC Around the World
      </h2>
      <div className="flex flex-col top-[90px] right-0 absolute items-end">
        <LoginSignup
          onLogin={onLogin}
          user={user}
          className="w-80 z-[401] mr-5"
        />

        <Scoreboard
          currentUser={user}
          fingerprint={fingerprint}
          className="z-[401] mr-5 max-h-[70vh]"
          setSelectedUser={setSelectedUser}
        />
      </div>
    </>
  );
}
