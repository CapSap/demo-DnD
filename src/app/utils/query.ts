import Database from "better-sqlite3";
import { ProntoData } from "../types/types";

export function exactSearch(searchString: string) {
  const db = new Database("prontoData.db");

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

export function likeSearch(searchString: string) {
  const db = new Database("prontoData.db");

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
  SELECT Style || ' ' || Colour || ' ' || Size || ' ' || Gender, ItemCode
  FROM prontoData;
`);

  // Check if the FTS table contains data
  const checkStatement = db.prepare(`SELECT * FROM prontoData_fts LIMIT 10 `);
  const checkRows = checkStatement.all();

  const statement = db.prepare(`
  SELECT prontoData.Style, prontoData.colour, prontoData.Size, prontoData.Gender, prontoData.ItemCode, combined, bm25(prontoData_fts) as rank
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
  return rows;
}
