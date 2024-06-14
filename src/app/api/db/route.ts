import { getStoreRequests } from "@/app/utils/dbConnect";

export async function GET(request: Request) {

    const data  = await getStoreRequests()


    return Response.json({ data })

}