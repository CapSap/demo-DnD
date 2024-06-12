import RequestCard from "../components/RequestCard";
import { getStoreRequests } from "../utils/dbConnect";

export default async function DashboardPage() {
  const requests = await getStoreRequests();

  console.log(requests);

  if ("error" in requests) {
    console.log(requests);
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
        <div className="m-10 flex flex-wrap gap-4">
          {requests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      </>
    );
  }
}
