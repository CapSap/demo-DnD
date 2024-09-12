"use client";

import { useState } from "react";
import { IStoreRequest } from "../types/types";

export function Dashboard({ requests }: { requests: IStoreRequest[] }) {
  const [store, setStore] = useState("default");

  const filteredRequsts = requests.filter(
    (request) => request.requestingStore === store,
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
      <div>
        <h2>summary</h2>
      </div>
    </div>
  );
}
