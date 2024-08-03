import { DB } from "@/database/db";
import { UserProperties } from "@/database/entities/user";

export async function POST(request: Request) {
  const params = (await request.json()) as UserProperties;

  const user = DB.getInstance().attemptLogin(params.username, params.password);

  const body = user ? user : { error: "Invalid username or password smh" };

  return Response.json(body);
}
