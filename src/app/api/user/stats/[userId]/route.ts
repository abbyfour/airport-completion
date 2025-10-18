import { DB } from "@/database/db";

export async function GET(
  _req: Request,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;

  const userDetails = DB.getInstance().userDetails.fetchUserDetails(
    parseInt(userId)
  );

  return Response.json(userDetails);
}
