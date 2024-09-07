import { MongoClient } from "mongodb";
import dotenv from "dotenv"

dotenv.config();

const connectionString = process.env.MONGODB_URI || "";
const dbName = process.env.MONGODB_DATABASE || "";

if (!connectionString) {
  throw new Error("MongoDB connection string (MONGODB_URI) is not defined or is empty.");
}

if (!dbName) {
  throw new Error("MongoDB database name (MONGODB_DATABASE) is not defined or is empty.");
}

const mongoClient = new MongoClient(connectionString);
let db;

async function connectToDatabase() {
  if (!db) {
    try {
      await mongoClient.connect();
      db = mongoClient.db(dbName);
      console.log("connection established to MongoDB Atlas");
    } catch(e) {
      console.error(e);
      throw error;
    }
  }
  return db;
}

export default connectToDatabase;