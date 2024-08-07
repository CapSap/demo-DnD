"use client";

import { HydratedDocument } from "mongoose";
import { IStoreRequest, Item } from "../types/types";
import { Fragment } from "react";

export default function RequestCard({
  request,
  handleSelect,
}: {
  request: IStoreRequest;
  handleSelect: (request: IStoreRequest) => void;
}) {
  return (
    <div id={request._id} className="min-w-72 border-2 border-slate-400 p-2">
      <input type="checkbox" onChange={() => handleSelect(request)} />
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
    </div>
  );
}
