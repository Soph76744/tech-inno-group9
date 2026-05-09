const express = require("express");
const router = express.Router();

const Tool = require("../models/Tool");
const Log = require("../models/Log");

const {
  ToolCreateSchema,
  ToolUpdateSchema,
} = require("../schemas/toolSchema");

// API routes for tools - GET, CREATE, UPDATE, DELETE
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
    console.error(err);

    res.status(500).json({
      error: "Server error",
    });
  }
});

// Get single tool
router.get("/:id", async (req, res) => {
  try {
    const tool = await Tool.findByPk(req.params.id);
    if (!tool) {
      return res.status(404).json({
        error: "Tool not found",
      });
    }
    res.json(tool);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Server error",
    });
  }
});

// Create tool
router.post("/", async (req, res) => {
  try {
    const { error } = ToolCreateSchema.validate(req.body);
    if (error) {
      return res.status(422).json({
        error: {
          message: error.details[0].message,
        },
      });
    }

    const tool = await Tool.create({
      name: req.body.name,
      type: req.body.type,
      location: req.body.location,
      status: "available",
      created_by:
        req.session?.user?.username || "unknown",
      last_checked_by:
        req.session?.user?.username || "unknown",
      last_checked: new Date(),
    });
    // Logs creation of tool
    await Log.create({
      user: req.session?.user?.username || "unknown",
      tool_id: tool.id,
      action: "Tool created",
      type: "creation",
    });

    res.status(201).json(tool);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Server error",
    });
  }
});

// Update tool
router.patch("/:id", async (req, res) => {
  try {
    const { error } = ToolUpdateSchema.validate(req.body);
    if (error) {
      return res.status(422).json({
        error: error.details[0].message,
      });
    }
    const tool = await Tool.findByPk(req.params.id);

    if (!tool) {
      return res.status(404).json({
        error: "Tool not found",
      });
    }

    tool.status = req.body.status;
    tool.last_checked_by =
      req.session?.user?.username || "unknown";
    tool.last_checked = new Date();
    await tool.save();
// Logs the creation of a tool
    await Log.create({
      user: req.session?.user?.username || "unknown",
      tool_id: tool.id,
      action:
        "Tool updated to " + req.body.status,
      type: "modification",
    });

    res.json(tool);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error",
    });
  }
});

// Delete tool
router.delete("/:id", async (req, res) => {
  try {
    const tool = await Tool.findByPk(req.params.id);

    if (!tool) {
      return res.status(404).json({
        error: "Tool not found",
      });
    }

    await tool.destroy();
// Logs the deletion of a tool
    await Log.create({
      user: req.session?.user?.username || "unknown",
      tool_id: tool.id,
      action: "Tool deleted",
      type: "deletion",
    });

    return res.status(200).json({
      success: true,
      message: "Tool deleted",
    });
  } catch (err) {
    console.error("DELETE ERROR:", err);

    return res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;