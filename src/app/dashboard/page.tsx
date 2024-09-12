import { Dashboard } from "../components/Dashboard";
import { getStoreRequests, updateOneStoreRequest } from "../utils/dbConnect";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PickAndDispatchPage() {
  const requests = await getStoreRequests();

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
        <h1>Dashboard Page</h1>
        <div className="m-10">
          <Dashboard requests={requests} />
        </div>
      </>
    );
  }
}
