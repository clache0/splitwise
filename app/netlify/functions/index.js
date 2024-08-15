import express from "express";
import cors from "cors";
import "./loadEnvironment.js";
import "express-async-errors";
import users from "./routes/users.js";
import groups from "./routes/groups.js";
import expenses from "./routes/expenses.js";

export const handler = async (event, context) => {
  const PORT = process.env.PORT || 5050;
  const app = express();

  // set up CORS for client server on different domain, protocol, port
  app.use(cors());

  // middleware to parse incoming requests with JSON payloads
  app.use(express.json());

  // Load the /users routes
  app.use("/users", users);

  // Load the /groups routes
  app.use("/groups", groups);

  // Load the /expenses routes
  app.use("/expenses", expenses);

  // Global error handling
  app.use((err, _req, res, next) => {
    res.status(500).send("Uh oh! An unexpected error occured.")
  })

  // start the Express server
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
  
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello from Netlify Functions" })
  };
}

