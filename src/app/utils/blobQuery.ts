import Database from "better-sqlite3";
import { ProntoCSV, ProntoData } from "../types/types";
import { list } from "@vercel/blob";

export async function exactLocalSearch(searchString: string) {
  const data = await list();
  const dlUrl = data.blobs[0].downloadUrl;

  async function fetchCSV() {
    // split download in 2 due to 2mb cache limit
    const resPartOne = await fetch(dlUrl, {
      headers: { range: "bytes=0-4194304" },
    });
    const resPartTwo = await fetch(dlUrl, {
      headers: { range: "bytes=-4194304" },
    });
    const csvDataOne = await resPartOne.text();
    const csvDataTwo = await resPartTwo.text();

    return csvDataOne + csvDataTwo;
  }

  const prontoData = await fetchCSV();

  function csvToJson(csvString: string): ProntoCSV[] {
    const rows = csvString.trim().split("\n");
    const headers = rows[0].split(",");

    const jsonArray = rows.slice(1).map((row) => {
      const values = row.split(",");
      const jsonObject = {
        Colour: "",
        GTIN: "",
        "Item Code": "",
        Size: "",
        Style: "",
      };
      headers.forEach((header, index) => {
        jsonObject[header.replace(/\s/g, "") as keyof ProntoCSV] =
          values[index].trim();
      });
      return jsonObject;
    });

    return jsonArray;
  }

  const db = new Database(":memory:", prontoData);

  const sanityCheckows = db.prepare("SELECT * FROM prontoData LIMIT 1").all();

  const statement = db.prepare(`
    SELECT ItemCode, Style, Colour, Size, Gender 
    FROM prontoData
    WHERE ItemCode = ? OR GTIN = ?
    LIMIT 30
  `);

  const rows = statement.all(searchString, searchString) as ProntoData[];

  db.close();
  return rows;
}

export async function likeLocalSearch(searchString: string) {
  console.log("first`");
  const data = await list();
  console.log("sec`");
  const dlUrl = data.blobs[0].downloadUrl;

  console.log(dlUrl);

  async function fetchCSV() {
    console.log("fetch running");

    // split download in 2 due to 2mb cache limit
    const resPartOne = await fetch(dlUrl, {
      headers: { range: "bytes=0-4194304" },
    });
    const resPartTwo = await fetch(dlUrl, {
      headers: { range: "bytes=-4194304" },
    });
    const csvDataOne = await resPartOne.text();
    const csvDataTwo = await resPartTwo.text();

    return csvDataOne + csvDataTwo;
  }

  const prontoData = await fetchCSV();

  function csvToJson(csvString: string) {
    const rows = csvString.trim().split("\n");
    const headers = rows[0]
      .split(",")
      .map((header) => header.replace(/\s/g, ""));

    const jsonArray = rows.slice(1).map((row) => {
      const values = row.split(",");
      const jsonObject: { [index: string]: string } = {};
      headers.forEach((header, index) => {
        jsonObject[header.trim()] = values[index].trim();
      });
      return jsonObject;
    });

    return jsonArray;
  }

  console.log("test");

  const json = csvToJson(prontoData);

  const db = new Database(":memory:");

  // Create a table based on CSV headers (assuming column names in CSV)
  const headers = Object.keys(json[0]).map((h) => h.replace(/\s/g, ""));

  const createTableQuery = `CREATE TABLE prontoData (${headers.map((h) => `"${h}" TEXT`).join(", ")});`;
  db.prepare(createTableQuery).run();

  // Insert CSV data into the database
  const insertQuery = `INSERT INTO prontoData (${headers.join(", ")}) VALUES (${headers.map(() => "?").join(", ")})`;
  const insertStmt = db.prepare(insertQuery);

  json.forEach((row) => {
    insertStmt.run(...headers.map((h) => row[h]));
  });

  db.exec(`DROP TABLE IF EXISTS prontoData_fts;`);

  // Create the FTS5 virtual table if it doesn't already exist
  db.exec(`
  CREATE VIRTUAL TABLE IF NOT EXISTS prontoData_fts
  USING fts5(
   combined,
   item_code UNINDEXED
  );
`);

  db.exec(`DELETE FROM prontoData_fts;`);

  db.exec(`
  INSERT INTO prontoData_fts (combined, item_code)
  SELECT Style || ' ' || Colour || ' ' || Size || ' ' , ItemCode
  FROM prontoData;
`);

  // Check if the FTS table contains data
  const checkStatement = db.prepare(`SELECT * FROM prontoData_fts LIMIT 10 `);
  const checkRows = checkStatement.all();

  const statement = db.prepare(`
  SELECT prontoData.Style, prontoData.colour, prontoData.Size, prontoData.ItemCode, combined, bm25(prontoData_fts) as rank
  FROM prontoData_fts
  JOIN prontoData on prontoData.ItemCode = prontoData_fts.item_code
  WHERE combined MATCH ?
  ORDER BY rank
  LIMIT 10
`);
  // remove spaces, add wildcard
  const formattedSearchString = searchString
    .split(/\s+/) // Split by one or more spaces
    .filter((term) => term.trim() !== "") // Filter out empty terms
    .map((term) => `${term.trim()}*`) // Add the wildcard operator
    .join(" "); // Join terms with a single space

  // Execute the query with the formatted search string
  const rows = statement.all(`${formattedSearchString}`) as ProntoData[];

  db.close();

  console.log("finsihed");
  return rows;
}
