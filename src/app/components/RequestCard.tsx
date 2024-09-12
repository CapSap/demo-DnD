"use client";

import { HydratedDocument } from "mongoose";
import { IStoreRequest, Item } from "../types/types";
import { Fragment } from "react";

export default function RequestCard({ request }: { request: IStoreRequest }) {
  return (
    <div className="m-2 min-w-96 justify-center border-2 border-slate-400 p-2">
      <p>
        Customer Name: <strong>{request.name}</strong>
      </p>

      <p>
        Customer Email: <strong>{request.email}</strong>
      </p>

      <p>
        Customer Phone: <strong>{request.phone}</strong>
      </p>

      <ul className="list-disc pl-6">
        {request.items.map((item: Item) => (
          <li key={item._id}>
            <p>
              {item.quantity} x {item.sku}
            </p>
            <p>{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
