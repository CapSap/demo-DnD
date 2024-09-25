"use client";
import { useContext, useState } from "react";
import { RequestContext } from "./RequestContext";
import { useRouter } from "next/navigation";
import { IStoreRequest } from "../types/types";
import RequestUpdateCard from "./RequestUpdateCard";
import RequestCardArchived from "./RequestCardArchived";
import RequestPickCard from "./RequestPickCard";

export default function PickAndDispatch({
  requests,
  updateOneStoreRequest,
}: {
  requests: IStoreRequest[];
  updateOneStoreRequest: (request: string) => Promise<string>;
}) {
  const [selected, setSelected] = useState<IStoreRequest[]>([]);
  const [_, setRequests] = useContext(RequestContext);

  const router = useRouter();

  function handleSelect(request: IStoreRequest) {
    setSelected((prev) => {
      if (prev.includes(request)) {
        return prev.filter((item) => item !== request);
      } else {
        return [...prev, request];
      }
    });
  }

  function handleButtonClick() {
    // save context
    console.log("click");
    setRequests(selected);
    // nav to picking
    router.push("/picking");
  }

  const requestsToPick = requests.filter(
    (request) => request.status === "issue picking" || request.status === "new",
  );

  const requestsToPost = requests.filter(
    (request) =>
      request.status === "ready to post" ||
      request.status === "ready to partial post",
  );

  const deletedRequests = requests.filter(
    (request) => request.status == "deleted",
  );

  async function handleDelete(request: IStoreRequest) {
    try {
      const payload = JSON.stringify({ ...request, status: "deleted" });

      const res = await updateOneStoreRequest(payload);
    } catch (err) {
      console.error("did not update", err);
    }
  }

  async function handlePartial(request: IStoreRequest) {
    try {
      const payload = JSON.stringify({
        ...request,
        status: "ready to partial post",
      });

      const res = await updateOneStoreRequest(payload);
    } catch (err) {
      console.error("did not update", err);
    }
  }

  return (
    <>
      <div>
        {requestsToPick.length > 0 ? (
          <button
            onClick={() => handleButtonClick()}
            className="rounded-lg bg-pink-400 px-6 py-2 text-center text-sm font-semibold outline-none ring-pink-300 transition duration-100 hover:bg-pink-500 focus-visible:ring active:bg-pink-700 md:text-base"
          >
            Go to picking page with your selected requests (Tick the requests
            that you want to pick)
          </button>
        ) : null}
      </div>
      <div>
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Orders TODO
        </h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {requestsToPick.length > 0 ? (
            requestsToPick.map((request) => (
              <RequestPickCard
                key={request._id}
                request={request}
                handleSelect={handleSelect}
                handleDelete={handleDelete}
                handlePartial={handlePartial}
              />
            ))
          ) : (
            <div className="flex w-full justify-center bg-gray-300 p-5">
              <p className="">There are no requests to pick!</p>
            </div>
          )}
        </div>
      </div>
      <div>
        <h2 className="mt-10 text-base font-semibold leading-7 text-gray-900">
          Orders finished picking and ready for IBT + posting out
        </h2>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {requestsToPost.length > 0 ? (
            requestsToPost.map((request) => (
              <RequestUpdateCard
                key={request._id}
                request={request}
                handleSelect={handleSelect}
                updateOneStoreRequest={updateOneStoreRequest}
              />
            ))
          ) : (
            <div className="flex w-full justify-center bg-gray-300 p-5">
              <p className="">There are no requests to post out!</p>
            </div>
          )}
        </div>
      </div>
      <div>
        <h2 className="mt-10 text-base font-semibold leading-7 text-gray-900">
          Archived Orders / things already posted
        </h2>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {requests &&
            requests
              .filter((request) => request.status === "posted")
              .map((request) => (
                <RequestCardArchived
                  key={request._id}
                  request={request}
                  updateOneStoreRequest={updateOneStoreRequest}
                />
              ))}
        </div>
        <h2 className="mt-10 text-base font-semibold leading-7 text-gray-900">
          Deleted orders (requests that were not able to be fufilled)
        </h2>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {deletedRequests &&
            deletedRequests.map((request) => (
              <RequestCardArchived
                key={request._id}
                request={request}
                updateOneStoreRequest={updateOneStoreRequest}
              />
            ))}
        </div>
      </div>
    </>
  );
}
