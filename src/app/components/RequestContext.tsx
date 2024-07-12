"use client";

import { SetStateAction, createContext, useState } from "react";

type IRequestContext = {
  _id: string;
  name: string;
  phone: string;
  requestingStore: string;
  email: string;
  address: string;
  items: {
    _id: string;
    sku: string;
    quantity: string;
    description: string;
    isPicked?: boolean;
  }[];
};

export const RequestContext = createContext<
  [IRequestContext, React.Dispatch<SetStateAction<IRequestContext>>]
>([
  {
    _id: "1",
    name: "Billy Bob",
    phone: "123123123",
    requestingStore: "Sydn",
    email: "restsetgo@gmail.com",
    address: "123 address road, NSW ,2000",
    items: [
      {
        _id: "1",
        sku: "506386",
        description: "Mont Sleeping Bag Storage Sack",
        quantity: "2",
      },
    ],
  },
  () => {},
]);

export default function RequestProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [picking, setPicking] = useState<IRequestContext>({
    _id: "1",
    name: "Billy Bob",
    phone: "123123123",
    requestingStore: "Sydn",
    email: "restsetgo@gmail.com",
    address: "123 address road, NSW ,2000",
    items: [
      {
        _id: "1",
        sku: "506386",
        description: "Mont Sleeping Bag Storage Sack",
        quantity: "2",
      },
    ],
  });

  return (
    <RequestContext.Provider value={[picking, setPicking]}>
      {children}
    </RequestContext.Provider>
  );
}
