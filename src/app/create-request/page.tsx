import CreateRequestForm from "../components/CreateRequestForm";
import dbConnect from "../utils/dbConnect";

export default function CreateRequestPage() {
  const client = dbConnect();
  return (
    <div>
      <CreateRequestForm />
    </div>
  );
}
