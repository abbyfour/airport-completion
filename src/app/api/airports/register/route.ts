import { DB } from "@/database/db";
import { AirportProperties } from "@/database/entities/airport";

export async function POST(request: Request) {
  const body: AirportProperties & { user_id: number } = await request.json();

  const airport = DB.getInstance().fetchOrCreateAirport(body);

  if (airport && body.user_id) {
    try {
      DB.getInstance().registerAirportForUser(body.user_id, airport.id);
    } catch (e: any) {
      return Response.json({ error: e.message }, { status: 500 });
    }

    return Response.json({ success: true }, { status: 201 });
  } else if (!body.user_id) {
    return Response.json({ error: "No user_id provided" }, { status: 400 });
  }
}
