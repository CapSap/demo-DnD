"use client";
import RequestCard from "./RequestCard";
import { useContext, useState } from "react";
import { RequestContext } from "./RequestContext";
import { useRouter } from "next/navigation";
import { IStoreRequest } from "../types/types";

export default function DashBoard({ requests }: { requests: IStoreRequest[] }) {
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
        <button onClick={() => handleButtonClick()}>
          click me to start picking
        </button>
      </div>
      <div>
        <h2>All orders</h2>
        <div className="m-10 flex flex-wrap gap-4">
          {requests &&
            requests.map((request) => (
              <RequestCard
                key={request._id}
                request={request}
                handleSelect={handleSelect}
              />
            ))}
        </div>
      </div>
      <div>
        <h2>Orders ready to post</h2>
      </div>
    </>
  );
}
