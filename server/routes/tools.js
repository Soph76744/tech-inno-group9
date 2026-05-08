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
      user: req.session?.user?.username || "unknown",
      tool_id: tool.id,
      action: "Tool created",
      type: "creation"
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
      user: req.session?.user?.username || "unknown",
      tool_id: tool.id,
      action: "Tool updated to " + req.body.status,
      type: "modification"
    });

    res.json(tool);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// delete a tool - delete if unnecessary
router.delete("/:id", async (req, res) => {
  try {
    console.log("Deleting tool id:", req.params.id);

    const tool = await Tool.findByPk(req.params.id);

    if (!tool) {
      console.log("Tool not found");
      return res.status(404).json({ error: "Tool not found" });
    }

    await tool.destroy();

    await Log.create({
      user: req.session?.user?.username || "unknown",
      tool_id: tool.id,
      action: "Tool deleted",
      type: "deletion"
    });

    console.log("Tool deleted successfully");

    return res.status(200).json({
      success: true,
      message: "Tool deleted"
    });

  } catch (err) {
    console.error("DELETE ERROR:", err);

    return res.status(500).json({
      error: err.message
    });
  }
});

module.exports = router;