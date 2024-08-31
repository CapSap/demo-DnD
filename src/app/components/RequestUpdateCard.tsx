"use client";

import { HydratedDocument } from "mongoose";
import { IStoreRequest, Item } from "../types/types";
import { Fragment, useState } from "react";

export default function RequestUpdateCard({
  request,
  handleSelect,
  updateOneStoreRequest,
}: {
  request: IStoreRequest;
  handleSelect: (request: IStoreRequest) => void;
  updateOneStoreRequest: (request: string) => Promise<string>;
}) {
  const [ibt, setIbt] = useState(request.ibt);
  const [tracking, setTracking] = useState(request.tracking);

  async function handleUpdate() {
    console.log("update button clicked ", { ...request, ibt, tracking });
    const payload = JSON.stringify({ ...request, ibt, tracking });
    const result = await updateOneStoreRequest(payload);
  }

  return (
    <div id={request._id} className="min-w-72 border-2 border-slate-400 p-2">
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
      <div>
        <label htmlFor="ibt">IBT</label>
        <input
          type="text"
          value={ibt}
          onChange={(e) => setIbt(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="tracking">tracking</label>
        <input
          type="text"
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
        />
      </div>
      <button onClick={handleUpdate}>Update</button>
    </div>
  );
}
