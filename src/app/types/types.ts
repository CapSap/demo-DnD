export type Item = {
  sku: string;
  quantity: string;
  description: string;
  id: number;
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

export type Payload = {
  name: string;
  phone: string;
  requestingStore: string;
  email: string;
  address: string;
  items: Item[];
};
