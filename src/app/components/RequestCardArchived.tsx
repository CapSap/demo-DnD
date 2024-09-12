"use client";

import { HydratedDocument } from "mongoose";
import { IStoreRequest, Item } from "../types/types";
import { Fragment } from "react";

export default function RequestCard({ request }: { request: IStoreRequest }) {
  return (
    <div id={request._id} className="min-w-96 border-2 border-slate-400 p-2">
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
        Posted on: <strong>{request.updatedAt}</strong>
      </p>
    </div>
  );
}
