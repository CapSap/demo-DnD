import { Timestamp } from "mongodb";
import mongoose, { mongo } from "mongoose";

const storeRequest = new mongoose.Schema(
  {
    name: String,
    phone: String,
    requestingStore: String,
    email: String,
    address: String,
    items: [{ sku: String, quantity: String, description: String }],
  },
  { timestamps: true }
);

export const StoreRequest =
  mongoose.models.StoreRequest || mongoose.model("StoreRequest", storeRequest);
