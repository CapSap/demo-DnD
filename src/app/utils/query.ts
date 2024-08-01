import Database from "better-sqlite3";

type ProntoData = {
  ID: number;
  ItemCode: string;
  GTIN: string;
  Style: string;
  Colour: string;
  Size: string;
  Gender: string;
  ItemCategoryCode: string;
  ItemClassCode: string;
  ABCClass: string;
  Brand: string;
};

export function exactSearch(searchString: string) {
  console.log("query func running");

  const db = new Database("prontoData.db");

  const sanityCheckows = db.prepare("SELECT * FROM prontoData LIMIT 1").all();
  console.log("Database Records:", sanityCheckows);

  const statement = db.prepare(`
    SELECT ItemCode, Style, Colour, Size, Gender 
    FROM prontoData
    WHERE ItemCode = ? OR GTIN = ?
    LIMIT 30
  `);

  const rows = statement.all(searchString, searchString) as ProntoData[];

  console.log("rows result", rows);

  db.close();
  return rows;
}

export function likeSearch(searchString: string) {
  const db = new Database("prontoData.db");

  // Prepare the SQL query
  const statement = db.prepare(`
      SELECT *
      FROM prontoData
      WHERE ItemCode LIKE ? OR GTIN LIKE ?
    `);

  // Execute the query with the search string
  const rows = statement.all(
    `%${searchString}%`,
    `%${searchString}%`,
  ) as ProntoData[];

  db.close();
  return rows;
}
