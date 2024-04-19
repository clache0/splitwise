import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import "express-async-errors";
import users from "./routes/users.mjs";

const PORT = process.env.PORT || 5050;
const app = express();

// set up CORS for client server on different domain, protocol, port
app.use(cors());

// middleware to parse incoming requests with JSON payloads
app.use(express.json());

// Load the /users routes
app.use("/users", users);
console.log("using /users route");

// Global error handling
app.use((err, _req, res, next) => {
  res.status(500).send("Uh oh! An unexpected error occured.")
})

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
