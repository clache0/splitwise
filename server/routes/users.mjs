import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get a list of users, limit 50
router.get("/", async (req, res) => {
  try {
    let collection = await db.collection("users");
    let results = await collection.find({})
      .limit(50)
      .toArray();

    res.send(results).status(200);
  } catch (error) {
    console.error("Error getting user: ", error);
    next(error);     
  }
});

// Get a single user
router.get("/:id", async (req, res) => {
  try {
    let collection = await db.collection("users");
    let query = {_id: ObjectId(req.params.id)};
    let result = await collection.findOne(query);
  
    if (result === null) {
      res.send("User not found").status(404);
    }
    else {
      res.send(result).status(200);
    }
  } catch (error) {
    console.error("Error getting user: ", error);
    next(error);     
  }
});

// POST Add a new document to the collection
router.post("/", async (req, res) => {
  try {
    let collection = await db.collection("users");
    let newDocument = req.body;
    let result = await collection.insertOne(newDocument);
    res.send(result).status(200);
  } catch (error) {
    console.error("Error adding user: ", error);
    next(error); 
  }
});

// PATCH Update the user
router.patch("/:id", async (req, res) => {
  const query = { _id: ObjectId(req.params.id) };
  const updates = {
    $set: { 
      firstName: req.body.firstName,
      lastName: req.body.lastName
    }
  };

  // attempt to update user
  try {
    let collection = await db.collection("users");
    let result = await collection.updateOne(query, updates);

    // check if user is found
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found" }); // user not found
    }

    res.send(result).status(200); // OK status
  } catch (error) {
    console.error("Error updating user: ", error);
    next(error); 
  }
});

// DELETE user
router.delete("/:id", async (req, res) => {
  const query = { _id: ObjectId(req.params.id) };

  try {
    const collection = db.collection("users");
    let result = await collection.deleteOne(query);
    
    // check if user is found
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "User not found" }); // user not found
    }

    res.send(result).status(200);
  } catch (error) {
    console.error("Error deleting user: ", error);
    next(error); 
  }

});

export default router;
