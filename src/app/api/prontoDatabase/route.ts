import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";
import fs from "fs";
import csv from "csv-parser";
import path from "path";

export async function GET(request: NextRequest) {
  console.time("prontodb");

  // Create or open the SQLite database
  const db = new Database("prontoData.db");

  // Function to initialize the database
  const initializeDatabase = () => {
    // Create a table (adjust the column definitions as needed)
    db.prepare(
      `CREATE TABLE IF NOT EXISTS prontoData (
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

    console.log(process.cwd());
    // Read the CSV file and insert the data into the database
    return new Promise((resolve, reject) => {
      const results = [];
      const csvFilePath = path.join(
        process.cwd(),
        "/src/app/api/prontoDatabase/pronto-database.csv",
      );
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", () => {
          insertMany(results);
          console.log(
            "CSV file successfully processed and data inserted into the database.",
          );
          resolve();
        })
        .on("error", (error) => {
          console.error("Error processing CSV file:", error);
          reject(error);
        });
    });
  };

  try {
    // Initialize the database and wait for the CSV processing to complete
    // await initializeDatabase();

    // Query the database (optional, for testing)
    const queryDatabase = () => {
      const rows = db.prepare("SELECT * FROM prontoData LIMIT 10").all();
      for (const row of rows) {
        console.log(row);
      }
    };

    // Query the database
    queryDatabase();
  } finally {
    // Close the database connection
    db.close();
  }

  console.timeEnd("prontodb");
  return NextResponse.json({ message: "CSV processed successfully" });
}
