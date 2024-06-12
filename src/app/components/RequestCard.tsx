import { HydratedDocument } from "mongoose";
import { IStoreRequest } from "../types/types";
import { Item } from "../types/types";
import { Fragment } from "react";

export default function RequestCard({
  request,
}: {
  request: HydratedDocument<IStoreRequest>;
}) {
  return (
    <div className="min-w-72 border-2 border-slate-400 p-2">
      <p>
        Requesting Store: <strong>{request.requestingStore}</strong>
      </p>
      <p>
        Customer Name: <strong>{request.name}</strong>
      </p>
      <p></p>

      <ul className="list-disc pl-6">
        {request.items.map((item: Item) => (
          <li key={item.id}>
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
