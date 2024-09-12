"use client";

import { useState } from "react";
import { IStoreRequest } from "../types/types";

export function Dashboard({ requests }: { requests: IStoreRequest[] }) {
  const [store, setStore] = useState();

  console.log(requests);
  return <div>dashboard compe</div>;
}
