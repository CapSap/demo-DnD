import mongoose, { mongo } from "mongoose";
import { IStoreRequest } from "../types/types";

const storeRequestSchema = new mongoose.Schema<IStoreRequest>(
  {
    name: String,
    phone: String,
    requestingStore: String,
    email: String,
    address: String,
    status: {
      type: String,
      enum: [
        "new",
        "issue picking",
        "ready to post",
        "ready to partial post",
        "posted",
        "deleted",
      ],
      default: "new",
    },
    notes: { type: String, default: "" },
    ibt: { type: String, default: "" },
    tracking: { type: String, default: "" },
    destination: String,
    items: [
      {
        sku: String,
        quantity: String,
        description: String,
        quantityPicked: { type: String, default: "0" },
        itemStatus: {
          type: String,
          enum: ["okay", "short picked", "new", "fully picked"],
          default: "new",
        },
      },
    ],
  },
  { timestamps: true },
);

export const StoreRequest =
  mongoose.models.StoreRequest ||
  mongoose.model<IStoreRequest>("StoreRequest", storeRequestSchema);
