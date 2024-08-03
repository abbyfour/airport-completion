import { DB } from "@/database/db";

export async function GET() {
  const scoreboard = await DB.getInstance().scoreboard();

  return Response.json(scoreboard);
}
