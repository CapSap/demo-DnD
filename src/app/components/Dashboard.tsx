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
    (request) => request.status === "ready to post",
  );

  const issueRequests = filteredRequsts.filter(
    (request) => request.status === "issue picking",
  );
  const inTransitRequests = filteredRequsts.filter(
    (request) => request.status === "posted",
  );

  return (
    <div>
      <div>
        <label
          className="flex flex-col text-sm text-gray-800 sm:text-base"
          htmlFor="requestingStore"
        >
          Select your store to see requests:
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
        <p>Please select your store from the above drop down</p>
      ) : (
        <div className="mt-4">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Summary
            </h2>
            <p>Numer of new/untouched requests: {newRequests.length}</p>
            <p>Numer of in progress requests: {processingRequests.length}</p>
            <p>Numer of in requests with issues : {issueRequests.length}</p>
            <p>Numer of in transit requests: {inTransitRequests.length}</p>
          </div>
          <div className="mt-4">
            {newRequests.length > 0 ? (
              <>
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  New requests
                </h2>
                {newRequests &&
                  newRequests.map((request) => (
                    <RequestCard
                      request={request}
                      key={request._id}
                      style={"bg-red-200"}
                    />
                  ))}
              </>
            ) : (
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                There are no new requests
              </h2>
            )}
          </div>
          <div className="mt-4">
            {processingRequests.length > 0 ? (
              <>
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Processing Requests
                </h2>
                {processingRequests &&
                  processingRequests.map((request) => (
                    <RequestCard
                      request={request}
                      key={request._id}
                      style={""}
                    />
                  ))}
              </>
            ) : (
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                There are no requests being proceesed
              </h2>
            )}
          </div>
          <div className="mt-4">
            {issueRequests.length > 0 ? (
              <>
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Requests with issues
                </h2>
                {issueRequests &&
                  issueRequests.map((request) => (
                    <RequestCard
                      request={request}
                      key={request._id}
                      style="bg-red-200"
                    />
                  ))}
              </>
            ) : (
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                There are no requests being proceesed
              </h2>
            )}
          </div>

          <div className="mt-4">
            {inTransitRequests.length > 0 ? (
              <>
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  In transit
                </h2>
                {inTransitRequests &&
                  inTransitRequests.map((request) => (
                    <RequestCard request={request} key={request._id} style="" />
                  ))}
              </>
            ) : (
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                There are no requests in transit
              </h2>
            )}
          </div>

          <div className="mt-4">
            <>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                All requests for your store
              </h2>
              {filteredRequsts &&
                filteredRequsts.map((request) => (
                  <RequestCard request={request} key={request._id} style="" />
                ))}
            </>
          </div>
        </div>
      )}
    </div>
  );
}
