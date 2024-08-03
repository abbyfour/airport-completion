import { User } from "@/database/entities/user";

type UserDisplayProps = {
  user: User;
};

export function UserDisplay({ user }: UserDisplayProps) {
  return (
    <div className="p-3">
      <p>
        Logged in as <span className="font-bold">{user.username}</span>
      </p>
    </div>
  );
}
