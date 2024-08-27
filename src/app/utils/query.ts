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
  console.log("exact search func running");

  const db = new Database("prontoData.db");

  const sanityCheckows = db.prepare("SELECT * FROM prontoData LIMIT 1").all();
  // console.log("Database Records:", sanityCheckows);

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
  console.log("like func running");
  const db = new Database("prontoData.db");

  db.exec(`DROP TABLE IF EXISTS prontoData_fts;`);

  // Create the FTS5 virtual table if it doesn't already exist
  db.exec(`
  CREATE VIRTUAL TABLE IF NOT EXISTS prontoData_fts
  USING fts5(
   combined 
  );
`);

  db.exec(`DELETE FROM prontoData_fts;`);

  db.exec(`
  INSERT INTO prontoData_fts (combined)
  SELECT Style || ' ' || Colour || ' ' || Size || ' ' || Gender
  FROM prontoData;
`);

  // Check if the FTS table contains data
  const checkStatement = db.prepare(
    `SELECT combined FROM prontoData_fts LIMIT 10 `,
  );
  const checkRows = checkStatement.all();
  console.log("FTS Data:", checkRows);

  const statement = db.prepare(`
  SELECT combined, bm25(prontoData_fts) as rank
  FROM prontoData_fts
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

  console.log("formatted", formattedSearchString);

  // Execute the query with the formatted search string
  const rows = statement.all(`${formattedSearchString}`) as ProntoData[];

  db.close();
  return rows;
}
