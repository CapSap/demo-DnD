// from https://github.com/vercel/next.js/blob/canary/examples/with-mongodb-mongoose/lib/dbConnect.ts

import mongoose, { HydratedDocument } from "mongoose";
import { StoreRequest } from "../db/model";
import { IStoreRequest, IStoreRequestFromDB } from "../types/types";
declare global {
  var mongoose: any; // This must be a `var` and not a `let / const`
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  console.log("con running");
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  try {
    cached.conn = await cached.promise;
    console.log("db conn succ");
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export const createStoreRequest = async (storeRequest: IStoreRequest) => {
  "use server";
  console.log("log from query function", storeRequest);
  try {
    await dbConnect();

    // throw new Error("could not write to db");

    await StoreRequest.create(storeRequest);
    return { message: "Store request created successfully" };
  } catch (error) {
    console.error(error);
    return {
      error: {
        message: "Failed to write to databse and create a new request",
        details: error,
      },
    };
  }
};

type StoreRequestsResult =
  | {
      error: {
        message: string;
        details: any;
      };
    }
  | IStoreRequestFromDB[];

export const getStoreRequests = async (): Promise<StoreRequestsResult> => {
  "use server";
  console.log("get requests running");

  try {
    await dbConnect();
    const requests: HydratedDocument<IStoreRequest[]> = await StoreRequest.find(
      {},
    ).lean();
    // only plain objects can be passed to client components from sever components
    const plainRequests: IStoreRequestFromDB[] = JSON.parse(
      JSON.stringify(requests),
    );
    return plainRequests;
  } catch (error) {
    console.error(error);
    return {
      error: {
        message: "Failed to get requets from database",
        details: error,
      },
    };
  }
};
