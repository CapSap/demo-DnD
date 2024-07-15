import { Timestamp } from "mongodb";
import mongoose, { mongo } from "mongoose";
import { IStoreRequest } from "../types/types";

const storeRequestSchema = new mongoose.Schema<IStoreRequest>(
  {
    name: String,
    phone: String,
    requestingStore: String,
    email: String,
    address: String,
    items: [
      {
        sku: String,
        quantity: String,
        description: String,
        quantityPicked: { type: String, default: "0" },
      },
    ],
  },
  { timestamps: true },
);

export const StoreRequest =
  mongoose.models.StoreRequest ||
  mongoose.model<IStoreRequest>("StoreRequest", storeRequestSchema);
