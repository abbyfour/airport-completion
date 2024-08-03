import { DB } from "@/database/db";

export async function GET() {
  const airports = DB.getInstance().fetchAllAirportsWithUsers();

  return Response.json(airports);
}
