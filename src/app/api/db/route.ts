import { getStoreRequests } from "@/app/utils/dbConnect";

export async function GET(request: Request) {
  console.log("fetch GET triggered");
  const data = await getStoreRequests();

  return Response.json({ data });
}
