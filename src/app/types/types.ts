export type Item = {
  _id: string;
  sku: string;
  quantity: string;
  description: string;
  itemStatus: ItemStatus;
  quantityPicked: string;
};

export type ItemStatus = "okay" | "short picked" | "new" | "fully picked";

export type PartialItem = Partial<
  Omit<Item, "_id" | "itemStatus" | "quantityPicked">
> & {
  tempID: number;
  sku: string;
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
  _id: string;
  name: string;
  phone: string;
  requestingStore: string;
  email: string;
  address: string;
  items: Item[];
  status: RequestStatus;
  ibt: string;
  tracking: string;
  updatedAt: string;
  destination: string;
};

export type RequestStatus =
  | "new"
  | "issue picking"
  | "ready to post"
  | "ready to partial post"
  | "posted"
  | "deleted";

export type IPartialStoreRequest = Partial<
  Omit<IStoreRequest, "_id" | "items" | "status">
> & {
  _id?: string;
  items: PartialItem[];
};

export type ProntoData = {
  ID: number;
  ItemCode: string;
  GTIN: string;
  Style: string;
  Colour: string;
  Size: string;
  Gender: string;
  ItemCategoryCode: string;
  ItemClassCode: string;
  ABCClass: string;
  Brand: string;
};

export type ProntoCSV = {
  Colour: string;
  GTIN: string;
  ItemCode: string;
  Size: string;
  Style: string;
};
