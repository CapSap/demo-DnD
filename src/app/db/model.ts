import mongoose, { mongo } from "mongoose";

const storeRequest = new mongoose.Schema({
  name: String,
});

export const StoreRequest =
  mongoose.models.StoreRequest || mongoose.model("StoreRequest", storeRequest);
