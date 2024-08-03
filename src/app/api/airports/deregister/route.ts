import { DB } from "@/database/db";

export async function POST(request: Request) {
  const body: { user_id: number; airport_id: number } = await request.json();

  try {
    DB.getInstance().deregisterAirport(body.user_id, body.airport_id);
    return Response.json({ success: true }, { status: 200 });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
