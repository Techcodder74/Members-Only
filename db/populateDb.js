import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const populateDb = async (t=false) => {
  const { default: pool } = await import("./pool.js");
  const { default: seedData } = await import("./data/data.js");

  const client = await pool.connect();

  try {
    console.log("Resetting database...");

    await client.query("BEGIN");

    const schemaPath = path.join(__dirname, "data", "schema.sql");
    const schemaSQL = fs.readFileSync(schemaPath, "utf8");

    await client.query(schemaSQL);
    console.log("Schema applied");

   
    for (const userData of seedData) {
      const userResult = await client.query(
        `INSERT INTO users (name, username, password, is_member)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [userData.name, userData.username, userData.password, userData.isMember]
      );
      
      const user = userResult.rows[0];

      for (const msg of userData.messages) {
        await client.query(
          `INSERT INTO messages (title, content, user_id)
           VALUES ($1, $2, $3)
           RETURNING *`,
          [msg.title, msg.content, user.id]
        );
      }
    }

    await client.query("COMMIT");
    console.log("Database populated successfully");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Population failed:", err.message);
  } finally {
    client.release();
   if(!t) await pool.end();
  }
};

export default populateDb;