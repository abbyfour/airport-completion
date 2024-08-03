import { DB } from "@/database/db";
import { UserProperties } from "@/database/entities/user";

export async function POST(request: Request) {
  const params = (await request.json()) as UserProperties;

  const user = DB.getInstance().createUser(params);

  const body = user ? user : { error: "Username is already taken" };

  return Response.json(body);
}
