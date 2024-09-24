"use client";

import { HydratedDocument } from "mongoose";
import { IStoreRequest, Item } from "../types/types";
import { Fragment } from "react";
import ConfirmButton from "./ConfirmButton";
import DeleteButton from "./DeleteButton";

export default function RequestPickCard({
  request,
  handleSelect,
  handleDelete,
}: {
  request: IStoreRequest;
  handleSelect: (request: IStoreRequest) => void;
  handleDelete: (request: IStoreRequest) => Promise<void>;
}) {
  return (
    <div className="m-2 justify-center border-2 border-slate-400">
      <div className="flex items-center rounded-lg bg-pink-200 hover:bg-pink-300 active:bg-pink-400">
        <input
          id={request._id}
          className="m-2 scale-150"
          type="checkbox"
          onClick={() => handleSelect(request)}
        />
        <label className="ml-2 w-full" htmlFor={request._id}>
          Click me to pick this order
        </label>
      </div>
      <ConfirmButton buttonText="Partially fulfil request" />
      <DeleteButton
        buttonText="Delete request"
        onConfirm={() => handleDelete(request)}
      />
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
