"use client";

import { HydratedDocument } from "mongoose";
import { IStoreRequest, Item } from "../types/types";
import { Fragment, useState } from "react";
import ConfirmButton from "./ConfirmButton";

export default function RequestUpdateCard({
  request,
  handleSelect,
  updateOneStoreRequest,
}: {
  request: IStoreRequest;
  handleSelect: (request: IStoreRequest) => void;
  updateOneStoreRequest: (request: string) => Promise<string>;
}) {
  const [ibt, setIbt] = useState<string | undefined>(request.ibt);
  const [tracking, setTracking] = useState<string | undefined>(
    request.tracking,
  );

  const [ibtError, setIbtError] = useState<string | null>(null);

  async function handleUpdate() {
    console.log("does ibt pass the test? ", ibt && /^d{7}$/.test(ibt));

    if (ibt && !/^\d{7}$/.test(ibt)) {
      setIbtError("IBT must be a 7-digit number.");
      return;
    }

    // update ibt and tracking, and update status if both fields are present
    const status = ibt && tracking ? "posted" : request.status;

    console.log("does this run");
    setIbtError(null);

    try {
      const payload = JSON.stringify({ ...request, ibt, tracking, status });
      const result = await updateOneStoreRequest(payload);
    } catch (err) {
      console.error("did not update", err);
    }
  }

  async function handleRedoPress() {
    const resetItems = request.items.map((item) => {
      return { ...item, quantityPicked: 0 };
    });
    try {
      const payload = JSON.stringify({
        ...request,
        status: "issue picking",
        items: resetItems,
      });
      const result = await updateOneStoreRequest(payload);
    } catch (err) {
      console.error("did not update", err);
    }
  }

  const isThereUnsavedChanges =
    ibt !== request.ibt || tracking !== request.tracking;

  return (
    <div id={request._id} className="min-w-96 border-2 border-slate-400 p-2">
      <p>
        Requesting Store: <strong>{request.requestingStore}</strong>
      </p>
      <ConfirmButton buttonText="Redo Picking" onConfirm={handleRedoPress} />
      <p>
        <span className="select-none">Customer Name: </span>
        <strong>{request.name}</strong>
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
      <div className="m-2 p-2">
        <p className="text-xl">
          <span className="select-none">Address: </span>
          <strong>{request.address}</strong>
        </p>

        <p className="text-xl">
          <span className="select-none">Phone: </span>
          <strong>{request.phone}</strong>
        </p>

        <p className="text-xl">
          <span className="select-none">Email: </span>
          <strong>{request.email}</strong>
        </p>
      </div>
      <div className="grid grid-cols-4 items-center justify-items-end gap-y-1 p-1">
        <label htmlFor="ibt" className="px-1">
          IBT{" "}
        </label>
        <input
          className="col-span-3 rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          type="text"
          value={ibt}
          onChange={(e) => setIbt(e.target.value)}
        />
        <label htmlFor="tracking" className="px-0.5">
          Tracking
        </label>
        <input
          className="col-span-3 rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          type="text"
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
        />
      </div>
      {isThereUnsavedChanges ? (
        <div className="m-2 flex items-center rounded-2xl bg-yellow-400 px-2 py-1">
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <p className="ml-2 font-bold">
            Warning: There are some unsaved changes
          </p>
        </div>
      ) : null}
      {ibtError && (
        <div className="m-2 text-red-500">
          <p>{ibtError}</p>
        </div>
      )}
      <button
        className="rounded-lg bg-indigo-400 px-6 py-2 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-500 focus-visible:ring active:bg-indigo-700 md:text-base"
        onClick={handleUpdate}
      >
        Update
      </button>
    </div>
  );
}
