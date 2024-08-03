import { DB } from "@/database/db";

export async function GET() {
  const scoreboard = await DB.getInstance().countryScoreboard();

  return Response.json(scoreboard);
}
