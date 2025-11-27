import { User } from "@/database/entities/user";

type UserDisplayProps = {
  user: User;
  logout: () => void;
};

export function UserDisplay({ user, logout }: UserDisplayProps) {
  return (
    <div className="p-3 flex align-middle gap-1">
      <p>
        Logged in as <span className="font-bold">{user.username}</span>
      </p>

      <button
        className="text-highlight hover:text-unique border-none bg-transparent hover:bg-transparent m-0 p-0 text-xs"
        type="button"
        onClick={logout}
      >
        (logout)
      </button>
    </div>
  );
}
