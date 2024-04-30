import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// GET a list of expenses, limit 50
router.get("/", async (req, res) => {
  try {
    let collection = await db.collection("expenses");
    let results = await collection.find({})
      .limit(50)
      .toArray();

    res.status(200).send(results);
  } catch (error) {
    console.error("Error getting expense: ", error);
    next(error);     
  }
});

// GET a single expense
router.get("/:id", async (req, res, next) => {
  try {
    let collection = await db.collection("expenses");
    let query = {_id: ObjectId(req.params.id)};
    let result = await collection.findOne(query);
  
    if (result === null) {
      res.status(404).send("expense not found");
    }
    else {
      res.status(200).send(result);
    }
  } catch (error) {
    console.error("Error getting expense: ", error);
    next(error);
  }
});

// GET expenses by group id
router.get("/group/:id", async (req, res, next) => {
  try {
    let collection = await db.collection("expenses");
    let query = { groupId: req.params.id };
    const result = await collection.find(query).toArray();
  
    if (result.length === 0) {
      res.status(404).send("No expenses found");
    }
    else {
      res.status(200).send(result);
    }
  } catch (error) {
    console.error("Error getting expense: ", error);
    next(error);
  }
});

// POST Add a new document to the collection
router.post("/", async (req, res) => {
  try {
    let collection = await db.collection("expenses");
    let newDocument = req.body;
    let result = await collection.insertOne(newDocument);
    res.status(200).send(result);
  } catch (error) {
    console.error("Error adding expense: ", error);
    next(error);
  }
});

// PATCH Update the expense
router.patch("/:id", async (req, res) => {
  const query = { _id: ObjectId(req.params.id) };
  console.log("query: ", query);
  const { title, amount, date, payerId, participants } = req.body;
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

  // attempt to update expense
  try {
    let collection = await db.collection("expenses");
    let result = await collection.updateOne(query, updates);

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
    console.error("Error updating expense: ", error);
    next(error);
  }
});

// DELETE expense
router.delete("/:id", async (req, res) => {
  const query = { _id: ObjectId(req.params.id) };

  try {
    const collection = db.collection("expenses");
    let result = await collection.deleteOne(query);
    
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

export default router;
