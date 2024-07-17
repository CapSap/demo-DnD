"use client";

import { createContext, useState } from "react";

export type IRequestContext = {
  _id: string;
  name: string;
  phone: string;
  requestingStore: string;
  email: string;
  address: string;
  status: "new" | "issue picking";
  items: {
    _id: string;
    sku: string;
    quantity: string;
    description: string;
    quantityPicked: string;
    itemStatus?: "okay" | "short picked";
  }[];
};

type ContextValueType = [
  IRequestContext[],
  React.Dispatch<React.SetStateAction<IRequestContext[]>>,
];

export const RequestContext = createContext<ContextValueType>([[], () => {}]);

export default function RequestProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [picking, setPicking] = useState<IRequestContext[]>([
    // im not sure if i want to set some inital default context, but ill try this and see
    {
      _id: "1",
      name: "Billy Bob",
      phone: "123123123",
      requestingStore: "Sydn",
      email: "restsetgo@gmail.com",
      address: "123 address road, NSW ,2000",
      status: "new",
      items: [
        {
          _id: "1",
          sku: "506386",
          description: "Mont Sleeping Bag Storage Sack",
          quantity: "2",
          quantityPicked: "0",
        },
        {
          _id: "2",
          sku: "50746702963NS",
          description: "Mont Batwing Ultralight Thru-Hiker Tarp",
          quantity: "3",
          quantityPicked: "0",
        },
      ],
    },
  ]);

  return (
    <RequestContext.Provider value={[picking, setPicking]}>
      {children}
    </RequestContext.Provider>
  );
}
