import CreateRequestForm from "../components/CreateRequestForm";
import { createStoreRequest as dbCreate, dbConnect } from "../utils/dbConnect";

export default function CreateRequestPage() {
  async function createStoreRequest(payload) {
    "use server";
    const response = await dbCreate(payload);

    if (response.error) {
      // Display a user-friendly error message to the user
      return `Error creating store request: ${response.error.message}. Details: ${response.error.details}`;
    }

    // Handle success response
    return `Store request created successfully!`;
  }

  return (
    <div>
      <CreateRequestForm createStoreRequest={createStoreRequest} />
    </div>
  );
}
