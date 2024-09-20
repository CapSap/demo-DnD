// from https://github.com/vercel/next.js/blob/canary/examples/with-mongodb-mongoose/lib/dbConnect.ts
import mongoose, { HydratedDocument } from "mongoose";
import { StoreRequest } from "../db/model";
import { IPartialStoreRequest, IStoreRequest, Item } from "../types/types";
import { revalidatePath } from "next/cache";

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

export const createStoreRequest = async (
  storeRequest: IPartialStoreRequest,
) => {
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
  | IStoreRequest[];

export const getStoreRequests = async (): Promise<StoreRequestsResult> => {
  "use server";
  console.log("get requests function running");

  try {
    await dbConnect();
    const requests: HydratedDocument<IStoreRequest[]> = await StoreRequest.find(
      {},
    ).lean();
    // only plain objects can be passed to client components from sever components
    const plainRequests: IStoreRequest[] = JSON.parse(JSON.stringify(requests));
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

function convertId<T extends IStoreRequest | Item>(
  object: T,
): T & { _id: mongoose.Types.ObjectId } {
  return {
    ...object,
    _id: mongoose.Types.ObjectId.createFromHexString(object._id),
  };
}

export const updateOneStoreRequest = async (request: string) => {
  "use server";

  revalidatePath("/pick-and-dispatch");
  try {
    // data from client must be a plain js object, mongo objects are not plain js ob (POJO)
    const parsedRequest = JSON.parse(request);
    const requestWithObjIds = {
      ...convertId(parsedRequest),
      items: parsedRequest.items.map((item: Item) => convertId(item)),
    };

    console.log("log from update one func", requestWithObjIds);

    await dbConnect();
    const result = await StoreRequest.updateOne(
      { _id: requestWithObjIds._id },
      {
        $set: {
          ibt: requestWithObjIds.ibt,
          tracking: requestWithObjIds.tracking,
          status: requestWithObjIds.status,
        },
      },
    );

    console.log(result.modifiedCount); // Output the number of modified documents

    return JSON.stringify(result); // Return the result
  } catch (err) {
    const error = err as Error; // Type assertion for better error handling
    return JSON.stringify({
      error: {
        message: `Failed to update the request. ${error.name}: ${error.message}`,
        stack: error.stack,
      },
    });
  }
};

export const updateManyStoreRequests = async (request: string) => {
  "use server";
  console.log("update many running...");

  // after updating many requests, get data again from db on the dashboard route
  revalidatePath("/dashboard");

  try {
    const manyRequests = JSON.parse(request);

    const requestsWithObjIds = manyRequests.map((request: IStoreRequest) => {
      return {
        ...convertId(request),
        items: request.items.map((item: Item) => convertId(item)),
      };
    });

    const bulkOps = requestsWithObjIds.map((request: IStoreRequest) => {
      return {
        updateOne: {
          filter: { _id: request._id },
          update: {
            $set: {
              status: request.status,
              items: request.items,
            },
          },
        },
      };
    });
    console.log(JSON.stringify(requestsWithObjIds));
    console.log(JSON.stringify(bulkOps));

    await dbConnect();
    const result = await StoreRequest.bulkWrite(bulkOps);
    console.log(result.modifiedCount);

    return JSON.stringify(result);
  } catch (err) {
    const error = err as Error; // Type assertion
    return JSON.stringify({
      error: {
        message: `Failed to update database. ${error.name}: ${error.message} `,
        stack: error.stack,
      },
    });
  }
};
