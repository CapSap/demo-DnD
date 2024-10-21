import CreateRequestForm from "../components/CreateRequestForm";
import { IPartialStoreRequest, IStoreRequest, ProntoCSV } from "../types/types";
import { createStoreRequest as dbCreate } from "../utils/dbConnect";
import { list } from "@vercel/blob";

export default async function CreateRequestPage() {
  async function createStoreRequest(request: IPartialStoreRequest) {
    "use server";
    const response = await dbCreate(request);
    if (response.error) {
      return {
        success: false,
        message: `Error creating store request: ${response.error.message}. Details: ${response.error.details}`,
      };
    }

    return { success: true, message: `Store request created successfully!` };
  }

  return (
    <div>
      <CreateRequestForm createStoreRequest={createStoreRequest} />
    </div>
  );
}
