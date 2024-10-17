import { NextRequest, NextResponse } from "next/server";
import { initializeProntoData } from "@/app/utils/initProntoDatabase";
import { exactSearch, likeSearch } from "@/app/utils/query";
import { exactLocalSearch, likeLocalSearch } from "@/app/utils/blobQuery";

export async function GET(request: NextRequest) {
  // Extract the search query from the request
  const { searchParams } = new URL(request.url);
  const searchString = searchParams.get("search") || "";

  // Call the query function
  // const exactResults = exactLocalSearch(searchString);

  const likeResults = await likeLocalSearch(searchString);

  return NextResponse.json({ likeResults });
}
