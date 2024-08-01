import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";
import fs from "fs";
import csv from "csv-parser";
import path from "path";
import { initializeProntoData, test } from "@/app/utils/initProntoDatabase";

export async function GET(request: NextRequest) {
  console.time("pronto data route");

  // this function should return an array of possible results or matches? from a search string (sku, barcode or product description)

  // so extract out what the search string is

  // then check the db.
  // to check the db, first if the db file needs to be updated.
  //    to do this check, compare the length or number of rows between the csv and the .db file.
  // if yes, re-create the db file

  // if not, then ready to proceed with check
  // search the db for any results

  // return results

  initializeProntoData();

  // test();

  console.timeEnd("pronto data route");
  return NextResponse.json({ message: "CSV processed successfully" });
}
