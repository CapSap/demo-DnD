import Link from "next/link";
import PickAndDispatch from "../components/PickAndDispatch";
import { getStoreRequests, updateOneStoreRequest } from "../utils/dbConnect";
import { initializeProntoData } from "../utils/initProntoDatabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PickAndDispatchPage() {
  const requests = await getStoreRequests();
  initializeProntoData();

  /*

  const requests = await fetch("http://localhost:3000/api/db", {
    cache: "no-store",
  })
    .then((res) => res.json())
    .then((res) => res.data);

*/

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
        <div className="m-10">
          <PickAndDispatch
            requests={requests}
            updateOneStoreRequest={updateOneStoreRequest}
          />
        </div>
      </>
    );
  }
}
