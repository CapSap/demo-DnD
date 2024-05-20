import CreateRequestForm from "../components/CreateRequestForm";
import { createStoreRequest, dbConnect } from "../utils/dbConnect";

export default function CreateRequestPage() {
  return (
    <div>
      <CreateRequestForm createStoreRequest={createStoreRequest} />
    </div>
  );
}
