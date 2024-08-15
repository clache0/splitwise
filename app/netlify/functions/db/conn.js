import { MongoClient } from "mongodb";

const connectionString = process.env.ATLAS_URI || "";

const client = new MongoClient(connectionString);

let conn;
try {
  conn = await client.connect();
  console.log("connection established to MongoDB Atlas");
} catch(e) {
  console.error(e);
}

let db = conn.db("splitwise");
console.log("using splitwise database");

export default db;