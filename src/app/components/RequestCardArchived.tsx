"use client";

import { IStoreRequest, Item } from "../types/types";
import ConfirmButton from "./ConfirmButton";

export default function RequestCard({
  request,
  updateOneStoreRequest,
}: {
  request: IStoreRequest;
  updateOneStoreRequest: (request: string) => Promise<string>;
}) {
  async function handleRedoPress() {
    try {
      const payload = JSON.stringify({ ...request, status: "ready to post" });
      const result = await updateOneStoreRequest(payload);
      console.log("result", payload, result);
    } catch (err) {
      console.error("did not update", err);
    }
  }
  return (
    <div id={request._id} className="border-2 border-slate-400 p-2">
      <p>
        Requesting Store: <strong>{request.requestingStore}</strong>
      </p>
      <p>
        Customer Name: <strong>{request.name}</strong>
      </p>

      <ul className="list-disc pl-6">
        {request.items.map((item: Item) => (
          <li key={item._id}>
            <p>
              {item.quantity} x {item.sku}
            </p>
            <p>{item.description}</p>
            <p>qty picked: {item.quantityPicked}</p>
          </li>
        ))}
      </ul>
      <p>
        IBT: <strong>{request.ibt}</strong>
      </p>
      <p>
        Tracking: <strong>{request.tracking}</strong>
      </p>
      <p>
        Last updated: <strong>{request.updatedAt}</strong>
      </p>
      <ConfirmButton
        buttonText="Redo IBT or tracking"
        onConfirm={handleRedoPress}
      />
    </div>
  );
}
