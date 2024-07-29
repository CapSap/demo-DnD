import Database from "better-sqlite3";
import fs from "fs";
import csv from "csv-parser";
import path from "path";

export async function initProntoDatabase() {
  // Create or open the SQLite database
  const db = new Database("prontoData.db");

  // Function to initialize the database
  const initializeDatabase = () => {
    // Create a table (adjust the column definitions as needed)
    db.prepare(
      `CREATE TABLE IF NOT EXISTS prontoData (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    ItemCode TEXT,
    GTIN TEXT,
    Style TEXT,
    Colour TEXT,
    Size TEXT,
    Gender TEXT,
    ItemCategoryCode TEXT,
    ItemClassCode TEXT,
    ABCClass TEXT,
    Brand TEXT
    )`,
    ).run();

    // Prepare the insert statement
    const insert = db.prepare(
      'INSERT INTO prontoData ("ItemCode", GTIN, Style, Colour, Size, Gender, ItemCategoryCode, ItemClassCode, ABCClass, Brand) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    );

    // Use a transaction for better performance
    const insertMany = db.transaction((rows) => {
      for (const row of rows) {
        insert.run(
          row.ItemCode,
          row.GTIN,
          row.Style,
          row.Colour,
          row.Size,
          row.Gender,
          row.ItemCategoryCode,
          row.ItemClassCode,
          row.ABCClass,
          row.Brand,
        );
      }
    });

    // Read the CSV file and insert the data into the database
    const results: {}[] = [];
    const csvFilePath = path.join(
      process.cwd(),
      "src/app/api/prontoDatabase/pronto-database.csv",
    );
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (data) => {
        results.push(data);
        return;
      })
      .on("end", () => {
        insertMany(results);
        console.log(
          "CSV file successfully processed and data inserted into the database.",
        );
        db.close();
      });
  };

  // Initialize the database
  initializeDatabase();

  // Query the database (optional, for testing)
  const queryDatabase = () => {
    const rows = db.prepare("SELECT * FROM prontoData LIMIT 10").all();
    for (const row of rows) {
      console.log("loggin the db", row);
    }
  };

  // Query the database
  queryDatabase();
}
