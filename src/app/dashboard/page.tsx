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
        <h1>Todos</h1>
        <div>
          {requests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      </>
    );
  }
}
