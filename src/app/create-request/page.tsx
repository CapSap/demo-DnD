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

  console.time("blob fetch`");

  // okay this is working. what to do now?
  // get the most recently uploaded blob (or delete/ overwrite blobs)
  // i can either sort the blob list, or overwrite the blob on upload so that there is only 1 blob ever.
  // rename the variables used to pass down to client
  // parse the csv file on the client side, and do the queries

  // im not sure if i want to pass the csv down as props.
  // could i create a server action here and pass the function down (no i cant- blobs larger than 2mb cannot be cached.)
  // how to get search string from client?

  // so that im not sending the csv on every component render?

  // running fuse js on client with about a 4mb file makes the client very slow.

  const data = await list();
  const dlUrl = data.blobs[0].downloadUrl;

  async function fetchCSV() {
    // split download in 2 due to 2mb cache limit
    const resPartOne = await fetch(dlUrl, {
      headers: { range: "bytes=0-4194304" },
    });
    const resPartTwo = await fetch(dlUrl, {
      headers: { range: "bytes=-4194304" },
    });
    const csvDataOne = await resPartOne.text();
    const csvDataTwo = await resPartTwo.text();

    return csvDataOne + csvDataTwo;
  }

  const prontoData = await fetchCSV();
  console.timeEnd("blob fetch`");

  function csvToJson(csvString: string) {
    const rows = csvString.trim().split("\n");
    const headers = rows[0].split(",");

    const jsonArray = rows.slice(1).map((row) => {
      const values = row.split(",");
      const jsonObject = {};
      headers.forEach((header, index) => {
        jsonObject[header.trim()] = values[index].trim();
      });
      return jsonObject;
    });

    return jsonArray;
  }

  const json = csvToJson(prontoData);

  return (
    <div>
      <CreateRequestForm
        createStoreRequest={createStoreRequest}
        prontoData={json}
      />
    </div>
  );
}
