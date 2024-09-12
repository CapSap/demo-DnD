"use client";

import { HydratedDocument } from "mongoose";
import { IStoreRequest, Item } from "../types/types";
import { Fragment } from "react";

export default function RequestCard({
  request,
  handleSelect,
}: {
  request: IStoreRequest;
  handleSelect: (request: IStoreRequest, index: number) => void;
}) {
  return (
    <div className="m-2 min-w-96 justify-center border-2 border-slate-400 p-2">
      <div className="rounded-lg bg-pink-200 hover:bg-pink-300 active:bg-pink-400">
        <input
          id={request._id}
          className="m-2 scale-150"
          type="checkbox"
          onClick={() => handleSelect(request)}
        />
        <label className="ml-2" htmlFor={request._id}>
          Click me to pick this order
        </label>
      </div>
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
            <p>Qty picked: {item.quantityPicked}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
