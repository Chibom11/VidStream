import { PrismaClient } from "../generated/prisma/index.js"
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    ca: fs.readFileSync("./ca.pem", "utf8"),
  },
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
  adapter,
});



