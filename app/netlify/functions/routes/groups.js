import express from "express";
import db from "../db/conn.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get a list of groups, limit 50
router.get("/", async (req, res) => {
  try {
    let collection = await db.collection("groups");
    let results = await collection.find({})
      .limit(50)
      .toArray();

    res.send(results).status(200);
  } catch (error) {
    console.error("Error getting group: ", error);
    next(error);     
  }
});

// Get a single group
router.get("/:id", async (req, res) => {
  try {
    let collection = await db.collection("groups");
    let query = {_id: ObjectId(req.params.id)};
    let result = await collection.findOne(query);
  
    if (result === null) {
      res.send("Group not found").status(404);
    }
    else {
      res.send(result).status(200);
    }
  } catch (error) {
    console.error("Error getting group: ", error);
    next(error);
  }
});

// POST Add a new document to the collection
router.post("/", async (req, res) => {
  try {
    let collection = await db.collection("groups");
    let newDocument = req.body;
    let result = await collection.insertOne(newDocument);
    res.send(result).status(200);
  } catch (error) {
    console.error("Error adding group: ", error);
    next(error);
  }
});

// PATCH Update the group
router.patch("/:id", async (req, res) => {
  const query = { _id: ObjectId(req.params.id) };
  const { name, members } = req.body;
  const updates = { $set: {} };

  if (name) {
    updates["$set"]["name"] = name;
  }
  if (members) {
    updates["$set"]["members"] = members.map(member => ({ "_id": member }));
  }

  // attempt to update group
  try {
    let collection = await db.collection("groups");
    let result = await collection.updateOne(query, updates);

    // check if group is found
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Group not found" });
    }
    // check if group is found
    if (result.modifiedCount === 0) {
      return res.status(200).json({ error: "Group not modified" });
    }
    res.send(result).status(200);
  } catch (error) {
    console.error("Error updating group: ", error);
    next(error); 
  }
});

// DELETE group
router.delete("/:id", async (req, res) => {
  const query = { _id: ObjectId(req.params.id) };

  try {
    const groupsCollection = db.collection("groups");
    const expensesCollection = db.collection("expenses");

    // delete associated expenses
    await expensesCollection.deleteMany({ groupId: req.params.id });

    // delete group
    let result = await groupsCollection.deleteOne(query);
    
    // check if group is found
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.send(result).status(200);
  } catch (error) {
    console.error("Error deleting group and associated expenses: ", error);
    next(error); 
  }
});

// get all groups for a user
router.get("/users/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const collection = db.collection("groups");
    const groups = await collection.find({ "members._id": userId }).toArray();
    res.status(200).json(groups);
  } catch (error) {
    console.error("Error fetching groups for user: ", error);
    res.status(500).json({ error: "Error fetching groups for user" });
  }
});

export default router;
