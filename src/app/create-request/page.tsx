import CreateRequestForm from "../components/CreateRequestForm";
import { IStoreRequest } from "../types/types";
import { createStoreRequest as dbCreate } from "../utils/dbConnect";

export default function CreateRequestPage() {
  async function createStoreRequest(request: IStoreRequest) {
    "use server";
    const response = await dbCreate(request);

    if (response.error) {
      return `Error creating store request: ${response.error.message}. Details: ${response.error.details}`;
    }

    return `Store request created successfully!`;
  }

  return (
    <div>
      <CreateRequestForm createStoreRequest={createStoreRequest} />
    </div>
  );
}
