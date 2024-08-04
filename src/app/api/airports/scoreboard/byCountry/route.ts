import { DB } from "@/database/db";

export async function GET() {
  const scoreboard = await DB.getInstance().byCountryScoreboard();

  return Response.json(scoreboard);
}
