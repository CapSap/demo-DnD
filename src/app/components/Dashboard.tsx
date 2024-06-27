"use client";
import { HydratedDocument } from "mongoose";
import RequestCard from "./RequestCard";
import { IStoreRequest } from "../types/types";
import { useState } from "react";

export default function DashBoard({ requests }) {
  return (
    <>
      <div className="m-10 flex flex-wrap gap-4">
        {requests &&
          requests.map((request) => (
            <>
              <RequestCard key={request._id} request={request} />
              <input type="checkbox" name="pick" id="pick" />
            </>
          ))}
      </div>
    </>
  );
}
