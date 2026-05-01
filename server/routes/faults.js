const express = require("express");
const router = express.Router();

const Fault = require("../models/Fault");

// Get all faults
router.get("/", async (req, res) => {
  try {
    const faults = await Fault.findAll();
    res.json(faults);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/detect", async (req, res) => {
  try {
    const fault = await Fault.findOne({
      where: { status: "open" }
    });

    if (!fault) {
      return res.json({
        detected: false,
        message: "No faults detected"
      });
    }

    res.json({
      detected: true,
      fault
    });

  } catch (err) {
    res.status(500).json({ error: "Detection failed" });
  }
});

// Create fault
router.post("/", async (req, res) => {
  try {
    const fault = await Fault.create(req.body);
    res.status(201).json(fault);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update fault status
router.patch("/:id", async (req, res) => {
  try {
    const fault = await Fault.findByPk(req.params.id);

    if (!fault) {
      return res.status(404).json({ error: "Fault not found" });
    }

    fault.status = req.body.status;
    await fault.save();

    res.json(fault);

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;