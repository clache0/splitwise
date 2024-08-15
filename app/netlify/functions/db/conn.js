import { MongoClient } from "mongodb";

const connectionString = process.env.ATLAS_URI || "";
const client = new MongoClient(connectionString);

let db;

async function connectToDatabase() {
  if (!db) {
    try {
      conn = await client.connect();
      db = conn.db("splitwise");
      console.log("Connected to MongoDB Atlas, using splitwise database.");
    } catch(e) {
      console.error("Error connection to MongoDB Atlas: ", e);
    }
  }
}

export default connectToDatabase;