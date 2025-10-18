import { DB } from "@/database/db";

export async function GET() {
  const scoreboard = await DB.getInstance().mostUniqueScoreboard();

  return Response.json(scoreboard);
}
