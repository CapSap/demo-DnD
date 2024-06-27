import Link from "next/link";
import DashBoard from "../components/Dashboard";
import { getStoreRequests } from "../utils/dbConnect";

export default async function DashboardPage() {
  const requests = await getStoreRequests();

  console.log("dashboard page log", requests[0]);

  if ("error" in requests) {
    return (
      <div>
        <p>
          Error somewhere! Could not display requets. Message from route:{" "}
          {requests.error.message}
        </p>
        <p>Details: {JSON.stringify(requests.error.details)}</p>
      </div>
    );
  } else {
    return (
      <>
        <h1>Seven Hills Todos (to be picked and posted)</h1>
        <Link href={"/picking"}>Go do some picking</Link>
        <div className="m-10 flex flex-wrap gap-4">
          <DashBoard requests={requests} />
        </div>
      </>
    );
  }
}
