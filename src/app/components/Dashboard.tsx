"use client";
import RequestCard from "./RequestCard";
import { useContext, useState } from "react";
import { RequestContext } from "./RequestContext";
import { useRouter } from "next/navigation";
import { IStoreRequest } from "../types/types";
import RequestUpdateCard from "./RequestUpdateCard";
import RequestCardArchived from "./RequestCardArchived";

export default function DashBoard({
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

  return (
    <>
      <div>
        <button
          onClick={() => handleButtonClick()}
          className="rounded-lg bg-pink-400 px-6 py-2 text-center text-sm font-semibold outline-none ring-pink-300 transition duration-100 hover:bg-pink-500 focus-visible:ring active:bg-pink-700 md:text-base"
        >
          Go to picking page with your selected requests (Tick the requests that
          you want to pick)
        </button>
      </div>
      <div>
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Orders TODO
        </h2>
        <div className="flex flex-wrap gap-4">
          {requests &&
            requests
              .filter(
                (request) =>
                  request.status === "issue picking" ||
                  request.status === "new",
              )
              .map((request) => (
                <RequestCard
                  key={request._id}
                  request={request}
                  handleSelect={handleSelect}
                />
              ))}
        </div>
      </div>
      <div>
        <h2 className="mt-10 text-base font-semibold leading-7 text-gray-900">
          Orders finished picking and ready for IBT + posting out
        </h2>
        <div className="flex flex-wrap gap-2">
          {requests &&
            requests
              .filter((request) => request.status === "ready to post")
              .map((request) => (
                <RequestUpdateCard
                  key={request._id}
                  request={request}
                  handleSelect={handleSelect}
                  updateOneStoreRequest={updateOneStoreRequest}
                />
              ))}
        </div>
      </div>
      <div>
        <h2 className="mt-10 text-base font-semibold leading-7 text-gray-900">
          Archived Orders / things already posted
        </h2>
        <div className="flex flex-wrap gap-2">
          {requests &&
            requests
              .filter((request) => request.status === "posted")
              .map((request) => (
                <RequestCardArchived key={request._id} request={request} />
              ))}
        </div>
      </div>
    </>
  );
}
