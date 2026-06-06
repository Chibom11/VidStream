import pg from "pg";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    ca: fs.readFileSync("./ca.pem", "utf8"),
  },
});

try {
  const result = await pool.query("SELECT NOW()");
  console.log(result.rows);
} catch (err) {
  console.error(err);
}