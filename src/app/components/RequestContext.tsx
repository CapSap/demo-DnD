"use client";

import { createContext, useState } from "react";
import { IStoreRequest } from "../types/types";

type ContextValueType = [
  IStoreRequest[],
  React.Dispatch<React.SetStateAction<IStoreRequest[]>>,
];

export const RequestContext = createContext<ContextValueType>([[], () => {}]);

export default function RequestProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [picking, setPicking] = useState<IStoreRequest[]>([
    // im not sure if i want to set some inital default context, but ill try this and see
  ]);

  return (
    <RequestContext.Provider value={[picking, setPicking]}>
      {children}
    </RequestContext.Provider>
  );
}
