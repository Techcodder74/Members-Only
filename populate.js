import dotenv from "dotenv";
dotenv.config();

const { default: populateDb } = await import("./db/populateDb.js");

await populateDb();