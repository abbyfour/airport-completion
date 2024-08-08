import { DB } from "@/database/db";
import { NextApiRequest } from "next";

export async function GET(
  _req: NextApiRequest,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;

  const userDetails = DB.getInstance().userDetails.fetchUserDetails(
    parseInt(userId)
  );

  return Response.json(userDetails);
}
