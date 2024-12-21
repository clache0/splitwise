import express from "express";
import connectToDatabase from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const expenseRouter = express.Router();

// GET a list of expenses, limit 50
expenseRouter.get("/", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = await db.collection("expenses");
    const results = await collection.find({})
      .limit(50)
      .toArray();

      if (results.length === 0) {
        res.status(204).send(); // no expenses found, status 204
      }
      else {
        res.status(200).send(results);
      }
    } catch (error) {
    console.error("Error getting expenses from get / ", error);
    next(error);     
  }
});

// GET a list of unsettled expenses, limit 50
expenseRouter.get("/unsettled", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = await db.collection("expenses");
    const results = await collection.find({ settled: false })
      .limit(50)
      .toArray();

      if (results.length === 0) {
        res.status(204).send(); // no expenses found, status 204
      }
      else {
        res.status(200).send(results);
      }
    } catch (error) {
    console.error("Error getting unsettled expenses from get /unsettled ", error);
    next(error);     
  }
});

// GET a single expense
expenseRouter.get("/:id", async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = await db.collection("expenses");
    const query = {_id: new ObjectId(req.params.id)};
    const result = await collection.findOne(query);
  
    if (result === null) {
      res.status(404).send("expense not found");
    }
    else {
      res.status(200).send(result);
    }
  } catch (error) {
    console.error("Error getting expense from get /:id ", error);
    next(error);
  }
});

// GET expenses by group id
expenseRouter.get("/group/:id", async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = await db.collection("expenses");
    const query = { groupId: req.params.id };
    const result = await collection.find(query).toArray();
  
    if (result.length === 0) {
      res.status(204).send();
    }
    else {
      res.status(200).send(result);
    }
  } catch (error) {
    console.error("Error getting expense from get /group/:id ", error);
    next(error);
  }
});

// GET settled expenses by group id
expenseRouter.get("/group/:id/settled", async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = await db.collection("expenses");
    const query = { groupId: req.params.id, settled: true };
    const result = await collection.find(query).toArray();
  
    if (result.length === 0) {
      res.status(204).send();
    }
    else {
      res.status(200).send(result);
    }
  } catch (error) {
    console.error("Error getting settled group expenses from get /group/:id/settled ", error);
    next(error);
  }
});

// GET unsettled expenses by group id
expenseRouter.get("/group/:id/unsettled", async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = await db.collection("expenses");
    const query = { groupId: req.params.id, settled: false };
    const result = await collection.find(query).toArray();
  
    if (result.length === 0) {
      res.status(204).send();
    }
    else {
      res.status(200).send(result);
    }
  } catch (error) {
    console.error("Error getting unsettled group expense from get /group/:id/unsettled ", error);
    next(error);
  }
});

// POST Add a new expense document to the collection
expenseRouter.post("/", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = await db.collection("expenses");
    const newDocument = req.body;
    const result = await collection.insertOne(newDocument);
    res.status(200).send(result);
  } catch (error) {
    console.error("Error adding expense from post / ", error);
    next(error);
  }
});

// POST array of expenses
expenseRouter.post("/import", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = await db.collection("expenses");
    const expenses = req.body;

    // check if expenses is array and not empty
    if (!Array.isArray(expenses) || expenses.length === 0) {
      return res.status(400).send("No expenses provided.");
    }

    const result = await collection.insertMany(expenses);
    res.status(200).send(result);
  } catch (error) {
    console.error("Error adding expenses from post /import ", error);
    next(error);
  }
});

// PATCH Update a single expense
expenseRouter.patch("/:id", async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };
  const { title, amount, date, payerId, participants, settled } = req.body;
  const updates = { $set: {} };

  if (title) {
    updates["$set"]["title"] = title;
  }
  if (amount) {
    updates["$set"]["amount"] = amount;
  }
  if (date) {
    updates["$set"]["date"] = date;
  }
  if (payerId) {
    updates["$set"]["payerId"] = payerId;
  }
  if (participants) {
    updates["$set"]["participants"] = participants.map(participant => (
      { "memberId": participant.memberId,
        "share": participant.share
    }));
  }
  if (settled) {
    updates["$set"]["settled"] = settled;
  }

  // attempt to update expense
  try {
    const db = await connectToDatabase();
    const collection = await db.collection("expenses");
    const result = await collection.updateOne(query, updates);

    // check if expense is found
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "expense not found" });
    }
    // check if expense is modified
    if (result.modifiedCount === 0) {
      return res.status(200).json({ error: "expense not modified" });
    }
    res.status(200).send(result);
  } catch (error) {
    console.error("Error updating expense from patch /:id ", error);
    next(error);
  }
});

// PATCH update multiple expenses at once
expenseRouter.patch("/batch/update", async (req, res) => {

  try {
    const expenses = req.body; // Expense[] to update
    console.log("Received expenses: ", expenses);

    if (!expenses || !Array.isArray(expenses) || expenses.length === 0) {
      return res.status(404).json({
        error: "Invalid request",
        message: "The request body must be a non-empty array of expenses.",
      });
    }

    const db = await connectToDatabase();
    const collection = await db.collection("expenses");

    // Prepare the bulk operations for updating the expenses
    const bulkOperations = expenses.map((expense) => ({
      updateOne: {
        filter: { _id: new ObjectId(expense._id) }, // Match by _id
        update: { $set: { settled: expense.settled } }, // Set new settled status
      },
    }));

    // Execute the bulk operation
    const result = await collection.bulkWrite(bulkOperations);

    res.status(200).json({
      message: "Batch update successful",
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      operations: expenses,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "Internal Server Error catch block",
      message: error.message,
    });
  }
});

// DELETE single expense
expenseRouter.delete("/:id", async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };

  try {
    const db = await connectToDatabase();
    const collection = db.collection("expenses");
    const result = await collection.deleteOne(query);
    
    // check if expense is found
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "expense not found" });
    }

    res.status(200).send(result);
  } catch (error) {
    console.error("Error deleting expense: ", error);
    next(error); 
  }
});

export default expenseRouter;