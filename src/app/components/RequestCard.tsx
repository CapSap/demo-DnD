"use client";

import { HydratedDocument } from "mongoose";
import { IStoreRequest, Item } from "../types/types";
import { Fragment } from "react";

export default function RequestCard({
  request,
  style,
}: {
  request: IStoreRequest;
  style: string;
}) {
  return (
    <div
      className={`m-2 min-w-96 justify-center border-2 border-slate-400 p-2 ${style}`}
    >
      <p>
        Request Status: <strong>{request.status}</strong>
      </p>

      <p>
        Customer Name: <strong>{request.name}</strong>
      </p>

      <p>
        Customer Email: <strong>{request.email}</strong>
      </p>

      <p>
        Customer Phone: <strong>{request.phone}</strong>
      </p>
      {request.notes ? (
        <p>
          Notes: <strong>{request.notes}</strong>
        </p>
      ) : null}

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
      {request.tracking ? (
        <div className="flex gap-2">
          <p>
            Tracking number: <strong>{request.tracking}</strong>
          </p>
          <a
            className="font-medium text-blue-600 hover:underline dark:text-blue-500"
            href={`https://auspost.com.au/mypost/track/details/${request.tracking}`}
            target="_blank"
            rel="noreferrer noopener"
          >
            Tracking link
          </a>
        </div>
      ) : null}
      {request.ibt ? (
        <p>
          IBT: <strong>{request.ibt}</strong>
        </p>
      ) : null}
    </div>
  );
}
