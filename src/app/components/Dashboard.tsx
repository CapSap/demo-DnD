"use client";

import { useState } from "react";
import { IStoreRequest } from "../types/types";
import RequestCard from "./RequestCard";

export function Dashboard({ requests }: { requests: IStoreRequest[] }) {
  const [store, setStore] = useState("default");

  const filteredRequsts = requests.filter(
    (request) => request.requestingStore === store,
  );

  const newRequests = filteredRequsts.filter(
    (request) => request.status === "new",
  );
  const processingRequests = filteredRequsts.filter(
    (request) =>
      request.status === "issue picking" || request.status === "ready to post",
  );
  const inTransitRequests = filteredRequsts.filter(
    (request) => request.status === "posted",
  );

  console.log(filteredRequsts);
  return (
    <div>
      <div>
        <label
          className="flex flex-col text-sm text-gray-800 sm:text-base"
          htmlFor="requestingStore"
        >
          Select your store location:
        </label>
        <select
          required={true}
          className="rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
          id={"requestingStore"}
          name="requestingStore"
          key={"requestingStore"}
          value={store}
          onChange={(e) => {
            setStore(e.target.value);
          }}
        >
          <option value={"default"} disabled={true}>
            Please choose an option
          </option>

          <option value="213">Canberra - 213</option>
          <option value="416">Fortitude Valley - 416</option>
          <option value="710">Hobart - 710</option>
          <option value="314">Melbourne - 314</option>
          <option value="208">Seven Hills - 208</option>
          <option value="615">Perth - 615</option>
          <option value="319">Ringwood - 319</option>
          <option value="210">Sydney - 210</option>
        </select>
      </div>

      {store === "default" ? (
        <p>Please choose a store </p>
      ) : (
        <div className="mt-4">
          <div>
            <h2>Summary</h2>
            <p>Numer of new/untouched requests: {newRequests.length}</p>
            <p>Numer of in progress requests: {processingRequests.length}</p>
            <p>Numer of in transit requests: {inTransitRequests.length}</p>
          </div>
          <div>
            <h2>New requests</h2>
            {newRequests &&
              newRequests.map((request) => (
                <RequestCard request={request} key={request._id} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
