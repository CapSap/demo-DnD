import Database from "better-sqlite3";
import fs from "fs";
import csv from "csv-parser";
import path from "path";

export async function initializeProntoData(): Promise<void> {
  // Check if the file exists
  /*   const filePath = "src/app/api/prontoDatabase/pronto-database.csv";

  const fileExists = await fs.promises
    .access(filePath)
    .then(() => true)
    .catch(() => false);

  if (!fileExists) {
    console.log("csv file does not exist. Exiting function.");
    return;
  } */

  // get the filename of the csv file

  function findCsvFile(): Promise<string | false> {
    return new Promise((resolve, reject) => {
      const directoryPath = path.join(process.cwd(), "prontoData/");

      // Check if the directory exists
      if (!fs.existsSync(directoryPath)) {
        resolve(false); // Return false if the directory does not exist
        return;
      }
      // Read the directory
      fs.readdir(directoryPath, (err, files) => {
        if (err) {
          reject(`Error reading directory: ${err}`);
          return;
        }

        // Loop through the files to find the first CSV file
        for (const file of files) {
          if (path.extname(file) === ".csv") {
            // Return the full path to the file
            resolve(path.join(directoryPath, file));
            return;
          }
        }
        // If no CSV file is found
        resolve(false);
      });
    });
  }

  const prontoCsvFileName = await findCsvFile();

  if (!prontoCsvFileName) {
    console.log("csv file does not exist. Exiting function.");
    return;
  } else {
    console.log(prontoCsvFileName);
  }

  const db = new Database("prontoData.db");

  // variable to count rows in the CSV file
  const countCSVRows = (): Promise<number> => {
    return new Promise((resolve, reject) => {
      let csvRowCount = 0;
      const csvFilePath = path.join(
        process.cwd(),
        "src/app/api/prontoDatabase/pronto-database.csv",
      );
      fs.createReadStream(prontoCsvFileName)
        .pipe(csv())
        .on("data", () => csvRowCount++)
        .on("end", () => resolve(csvRowCount))
        .on("error", (error) => reject(error));
    });
  };

  // variable to count rows in the database table
  type RowCount = { count: number };

  const countDBRows = () => {
    const row = db
      .prepare("SELECT COUNT(*) AS count FROM prontoData")
      .get() as RowCount;
    return row ? row.count : 0;
  };

  // Check if the table exists for first time running
  const tableExists = () => {
    const row = db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='prontoData'",
      )
      .get();
    return row !== undefined;
  };

  // Start the check and initialization process
  await checkAndInitialize();

  // Function to check and initialize the database
  async function checkAndInitialize() {
    try {
      if (!tableExists()) {
        console.log("Table does not exist. Recreating the database...");
        await recreateDatabase();
        return;
      }

      const csvRowCount = await countCSVRows();
      const dbRowCount = countDBRows();

      if (csvRowCount !== dbRowCount) {
        console.log("Row counts differ. Recreating the database...");
        await recreateDatabase();
      } else {
        console.log("Row counts match. No need to recreate the database.");
        db.close();
      }
    } catch (error) {
      console.error("Error initializing the database:", error);
      db.close();
    }
  }

  // helper function to recreate the database
  async function recreateDatabase(): Promise<void> {
    // Drop the existing table if it exists
    db.prepare("DROP TABLE IF EXISTS prontoData").run();

    // Create a new table with an ID column
    db.prepare(
      `CREATE TABLE prontoData (
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
      "INSERT INTO prontoData (ItemCode, GTIN, Style, Colour, Size, Gender, ItemCategoryCode, ItemClassCode, ABCClass, Brand) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    );

    // Use a transaction for better performance
    const insertMany = db.transaction((rows) => {
      for (const row of rows) {
        insert.run(
          row["Item Code"],
          row.GTIN,
          row.Style,
          row.Colour,
          row.Size,
          row.Gender,
          row["Item Category Code"],
          row["Item Class Code"],
          row["ABC Class"],
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

    return new Promise<void>((resolve, reject) => {
      fs.createReadStream(prontoCsvFileName as string)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", () => {
          insertMany(results);
          db.close();
          resolve();
        })
        .on("error", (error) => {
          console.error("Error reading CSV file:", error);
          db.close();
          reject(error);
        });
    });
  }
}
