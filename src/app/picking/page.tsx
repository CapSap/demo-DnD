import PickingList from "../components/PickingList";

import { updateManyStoreRequests } from "../utils/dbConnect";

export default function PickingPage() {
  return (
    <div>
      <h1>Scan to pick page</h1>
      <p>Please start scanning to pick items</p>
      <PickingList updateManyStoreRequests={updateManyStoreRequests} />
    </div>
  );
}
