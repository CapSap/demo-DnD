import CreateRequestForm from "../components/CreateRequestForm";
import { IPartialStoreRequest, IStoreRequest } from "../types/types";
import { createStoreRequest as dbCreate } from "../utils/dbConnect";
import { list } from "@vercel/blob";

export default async function CreateRequestPage() {
  async function createStoreRequest(request: IPartialStoreRequest) {
    "use server";
    const response = await dbCreate(request);
    if (response.error) {
      return `Error creating store request: ${response.error.message}. Details: ${response.error.details}`;
    }

    return `Store request created successfully!`;
  }

  const data = await list();
  const dlUrl = data.blobs[0].downloadUrl;
  console.log("BLOB DATA");

  async function fetchCSV() {
    const res = await fetch(dlUrl);
    const csvData = await res.text();
    return csvData;
  }

  const testing = await fetchCSV();

  console.log("testing", testing);

  return (
    <div>
      <CreateRequestForm createStoreRequest={createStoreRequest} />
    </div>
  );
}
