import { AirportsDB } from "@/database/airports/AirportsDB";

export async function POST(request: Request) {
  const { code }: { code: string } = await request.json();

  if (code) {
    const airport = await AirportsDB.findAirportByCode(code);

    if (airport) {
      return Response.json({ airport }, { status: 200 });
    } else if (!airport) {
      return Response.json({ error: "Airport not found" }, { status: 404 });
    }
  } else {
    return Response.json({ error: "No code provided" }, { status: 400 });
  }
}
