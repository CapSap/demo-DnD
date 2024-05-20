import CreateRequestForm from "../components/CreateRequestForm";
import { createStoreRequest, dbConnect } from "../utils/dbConnect";

export default function CreateRequestPage() {
  async function createRequest() {
    "use server";
    await createStoreRequest({});
  }

  return (
    <div>
      <CreateRequestForm createStoreRequest={createStoreRequest} />
    </div>
  );
}
