"use client";

import { createContext } from "react";

export const RequestContext = createContext({});

export default function RequestProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequestContext.Provider value="dark">{children}</RequestContext.Provider>
  );
}
