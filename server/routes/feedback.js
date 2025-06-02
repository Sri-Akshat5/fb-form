const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");

// Submit feedback
router.post("/", async (req, res) => {
  const { name, message, remarks} = req.body;
  try {
    const feedback = new Feedback({ name, message, remarks  });
    await feedback.save();
    res.status(201).json(feedback);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all feedback
router.get("/", async (req, res) => {
  const feedback = await Feedback.find().sort({ createdAt: -1 });
  res.json(feedback);
});

module.exports = router;
