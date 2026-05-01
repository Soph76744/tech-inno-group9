const express = require("express");
const router = express.Router();

const Tool = require("../models/Tool");
const Log = require("../models/Log");
const { ToolCreateSchema, ToolUpdateSchema } = require("../schemas/toolSchema");

// Get all tools
router.get("/", async (req, res) => {
  try {
    const { status } = req.query;

    let where = {};
    if (status) {
      where.status = status;
    }

    const tools = await Tool.findAll({ where });
    res.json(tools);

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get single tool
router.get("/:id", async (req, res) => {
  try {
    const tool = await Tool.findByPk(req.params.id);

    if (!tool) {
      return res.status(404).json({ error: "Tool not found" });
    }

    res.json(tool);

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Create tool
router.post("/", async (req, res) => {
  try {
    const { error } = ToolCreateSchema.validate(req.body);

    if (error) {
      return res.status(422).json({
        error: {
          message: error.details[0].message
        }
      });
    }

    const tool = await Tool.create({
      name: req.body.name,
      type: req.body.type,
      location: req.body.location,
      status: "available"
    });

    // Log creation
    await Log.create({
      tool_id: tool.id,
      action: "created",
      user: "engineer"
    });

    res.status(201).json(tool);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update tool status
router.patch("/:id", async (req, res) => {
  try {
    const { error } = ToolUpdateSchema.validate(req.body);

    if (error) {
      return res.status(422).json({ error: error.details[0].message });
    }

    const tool = await Tool.findByPk(req.params.id);

    if (!tool) {
      return res.status(404).json({ error: "Tool not found" });
    }

    tool.status = req.body.status;
    tool.last_checked_by = "engineer";
    await tool.save();

    // Log status change
    await Log.create({
      tool_id: tool.id,
      action: req.body.status,
      user: "engineer"
    });

    res.json(tool);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;