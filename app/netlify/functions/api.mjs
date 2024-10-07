import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import "express-async-errors";
import serverless from "serverless-http"
import groupRouter from "./routes/groups.mjs";
import expenseRouter from "./routes/expenses.mjs";
import userRouter from "./routes/users.mjs";

dotenv.config();

const app = express();

// set up CORS for client server on different domain, protocol, port
app.use(cors());

// middleware to parse incoming requests with JSON payloads
app.use(express.json());

// Load routes
app.use('/.netlify/functions/api/groups', groupRouter);
app.use('/.netlify/functions/api/expenses', expenseRouter);
app.use('/.netlify/functions/api/users', userRouter);

// Global error handling
app.use((err, _req, res, next) => {
  res.status(500).send("Uh oh! An unexpected error occured.")
})

export const handler = serverless(app);
