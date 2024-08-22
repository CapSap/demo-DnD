import { NextRequest, NextResponse } from "next/server";
import { initializeProntoData } from "@/app/utils/initProntoDatabase";
import { exactSearch, likeSearch } from "@/app/utils/query";

export async function GET(request: NextRequest) {
  console.time("pronto data route");

  await initializeProntoData();

  console.log("route has moved on");

  // Extract the search query from the request
  const { searchParams } = new URL(request.url);
  const searchString = searchParams.get("search") || "";

  // Call the query function
  const exactResults = exactSearch(searchString);

  const likeResults = likeSearch(searchString);

  console.timeEnd("pronto data route");
  return NextResponse.json({ exactResults, likeResults });
}
