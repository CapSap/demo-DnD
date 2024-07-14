export type Item = {
  id: string;
  sku: string;
  quantity: string;
  description: string;
};
export type ItemDB = {
  _id: string;
  sku: string;
  quantity: string;
  description: string;
};

export type Store =
  | "213"
  | "416"
  | "710"
  | "314"
  | "208"
  | "615"
  | "319"
  | "210";

export type IStoreRequest = {
  name: string;
  phone: string;
  requestingStore: string;
  email: string;
  address: string;
  items: Item[];
};

export type IStoreRequestFromDB = {
  _id: string;
  name: string;
  phone: string;
  requestingStore: string;
  email: string;
  address: string;
  items: ItemDB[];
};
