/**
 * SmartLab Equipment Manager — API Routes
 * CADMech Full Stack Assessment
 *
 * TODO: Implement all the routes below.
 *
 * Each route handler should:
 * 1. Validate input data
 * 2. Perform the database operation
 * 3. Return appropriate HTTP status codes
 * 4. Return meaningful error messages
 *
 * Refer to README.md for request/response examples.
 */

const express = require("express");
const router = express.Router();
const db = require("../db/connection");

// Centralized validation arrays matching schema constraints
const VALID_TYPES = [
  "CNC Machine",
  "IoT Sensor",
  "Automation Trainer",
  "PLC Module",
  "Hydraulic System",
  "Pneumatic System",
  "Electrical Panel",
];
const VALID_STATUSES = ["Active", "Under Maintenance", "Decommissioned"];

// Helper validation middleware to isolate business logic
const validateEquipmentData = (req, res, next) => {
  const { name, type, status, serial_number } = req.body;
  const errors = {};

  if (!name || !name.trim()) errors.name = "Equipment name is required.";
  if (!type || !VALID_TYPES.includes(type))
    errors.type = `Type must be one of: ${VALID_TYPES.join(", ")}`;
  if (!status || !VALID_STATUSES.includes(status))
    errors.status = `Status must be one of: ${VALID_STATUSES.join(", ")}`;
  if (!serial_number || !serial_number.trim())
    errors.serial_number = "Serial number is required.";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      error: "Validation Error",
      message: "Invalid data parameters provided.",
      details: errors,
    });
  }
  next();
};

// ─── GET /api/equipment ────────────────────────────────────
// List all equipment
// Optional query params: ?search=keyword&type=CNC Machine&status=Active
router.get("/equipment", async (req, res) => {
  try {
    // TODO: Implement — fetch all equipment from database
    // Support search, type filter, and status filter via query params
    const { search, type, status } = req.query;
    let sql = "SELECT * FROM equipment WHERE 1=1";
    const params = [];

    if (search && search.trim()) {
      sql += " AND (name LIKE ? OR serial_number LIKE ? OR description LIKE ?)";
      const searchWildcard = `%${search.trim()}%`;
      params.push(searchWildcard, searchWildcard, searchWildcard);
    }

    if (type && VALID_TYPES.includes(type)) {
      sql += " AND type = ?";
      params.push(type);
    }

    if (status && VALID_STATUSES.includes(status)) {
      sql += " AND status = ?";
      params.push(status);
    }

    // Sort matching profiles descending by latest creation sequence
    sql += " ORDER BY created_at DESC";

    const items = await db.all(sql, params);
    res.json({
      status: "success",
      query: req.query,
      results: items.length,
      data: items,
    });

    // Example placeholder response (remove this and add your implementation):
    // res.json({
    //   message: 'TODO: Implement GET /api/equipment',
    //   query: req.query,
    //   data: [],
    // });
  } catch (error) {
    console.error("Error fetching equipment:", error);
    res.status(500).json({ error: "Failed to fetch equipment" });
  }
});

// ─── GET /api/equipment/:id ────────────────────────────────
// Get a single equipment item by ID
router.get("/equipment/:id", async (req, res) => {
  try {
    // TODO: Implement — fetch single equipment by req.params.id
    const item = await db.get("SELECT * FROM equipment WHERE id = ?", [
      req.params.id,
    ]);

    if (!item) {
      return res.status(404).json({
        error: "Not Found",
        message: `Equipment profile with ID ${req.params.id} does not exist.`,
      });
    }

    res.json({ status: "success", data: item, id: req.params.id });

    // res.json({
    //   message: 'TODO: Implement GET /api/equipment/:id',
    //   id: req.params.id,
    // });
  } catch (error) {
    console.error("Error fetching equipment:", error);
    res.status(500).json({ error: "Failed to fetch equipment" });
  }
});

// ─── POST /api/equipment ───────────────────────────────────
// Create new equipment
// Required fields: name, type, status
// Optional fields: location, serial_number, description, installed_date
router.post("/equipment", validateEquipmentData, async (req, res) => {
  try {
    // const { name, type, status, location, serial_number, description, installed_date } = req.body;

    // // TODO: Validate required fields
    // if (!name || !type || !status) {
    //   return res.status(400).json({
    //     error: 'Validation Error',
    //     message: 'name, type, and status are required fields',
    //   });
    // }

    // TODO: Insert into database and return the created record

    // res.status(201).json({
    //   message: 'TODO: Implement POST /api/equipment',
    //   received: req.body,
    // });
    const {
      name,
      type,
      status,
      location,
      serial_number,
      description,
      installed_date,
    } = req.body;

    // Check if Serial Number collision exists prior to statement processing
    const duplicate = await db.get(
      "SELECT id FROM equipment WHERE serial_number = ?",
      [serial_number.trim()],
    );
    if (duplicate) {
      return res.status(400).json({
        error: "Conflict Error",
        message: `Equipment with serial number '${serial_number}' already exists.`,
      });
    }

    const result = await db.run(
      `
      INSERT INTO equipment (name, type, status, location, serial_number, description, installed_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      [
        name.trim(),
        type,
        status,
        location ? location.trim() : null,
        serial_number.trim(),
        description ? description.trim() : null,
        installed_date || null,
      ],
    );

    const createdRecord = await db.get("SELECT * FROM equipment WHERE id = ?", [
      result.lastID,
    ]);
    res.status(201).json({ status: "success", data: createdRecord });
  } catch (error) {
    console.error("Error creating equipment:", error);
    res.status(500).json({ error: "Failed to create equipment" });
  }
});

// ─── PUT /api/equipment/:id ────────────────────────────────
// Update an existing equipment item
router.put("/equipment/:id", validateEquipmentData, async (req, res) => {
  try {
    // TODO: Implement — update equipment by req.params.id with req.body

    // res.json({
    //   message: "TODO: Implement PUT /api/equipment/:id",
    //   id: req.params.id,
    //   updates: req.body,
    // });
    const { id } = req.params;
    const {
      name,
      type,
      status,
      location,
      serial_number,
      description,
      installed_date,
    } = req.body;

    const existingRecord = await db.get(
      "SELECT id FROM equipment WHERE id = ?",
      [id],
    );
    if (!existingRecord) {
      return res.status(404).json({
        error: "Not Found",
        message: `Cannot modify record. Target ID ${id} does not exist.`,
      });
    }

    // Verify serial number modifications don't collide with other profiles
    const conflictRecord = await db.get(
      "SELECT id FROM equipment WHERE serial_number = ? AND id != ?",
      [serial_number.trim(), id],
    );
    if (conflictRecord) {
      return res.status(400).json({
        error: "Conflict Error",
        message: `Serial number '${serial_number}' is already assigned to a different asset.`,
      });
    }

    await db.run(
      `
      UPDATE equipment 
      SET name = ?, type = ?, status = ?, location = ?, serial_number = ?, description = ?, installed_date = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
      [
        name.trim(),
        type,
        status,
        location ? location.trim() : null,
        serial_number.trim(),
        description ? description.trim() : null,
        installed_date || null,
        id,
      ],
    );

    const updatedRecord = await db.get("SELECT * FROM equipment WHERE id = ?", [
      id,
    ]);
    res.json({
      status: "success",
      message: "Record customized successfully.",
      data: updatedRecord,
    });
  } catch (error) {
    console.error("Error updating equipment:", error);
    res.status(500).json({ error: "Failed to update equipment" });
  }
});

// ─── DELETE /api/equipment/:id ─────────────────────────────
// Delete an equipment item
router.delete("/equipment/:id", async (req, res) => {
  try {
    // TODO: Implement — delete equipment by req.params.id

    // res.json({
    //   message: "TODO: Implement DELETE /api/equipment/:id",
    //   id: req.params.id,
    // });
    const { id } = req.params;
    const existingRecord = await db.get(
      "SELECT id FROM equipment WHERE id = ?",
      [id],
    );

    if (!existingRecord) {
      return res
        .status(404)
        .json({
          error: "Not Found",
          message: `Cannot delete record. Target ID ${id} does not exist.`,
        });
    }

    await db.run("DELETE FROM equipment WHERE id = ?", [id]);
    res.json({
      status: "success",
      message: `Equipment profile asset ${id} successfully removed from laboratory index.`,
    });
  } catch (error) {
    console.error("Error deleting equipment:", error);
    res.status(500).json({ error: "Failed to delete equipment" });
  }
});

// ─── GET /api/stats ────────────────────────────────────────
// Get dashboard statistics
// Should return: total count, active count, maintenance count, decommissioned count
router.get("/stats", async (req, res) => {
  try {
    // TODO: Implement — query database for counts by status
    const counts = await db.all(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status = 'Under Maintenance' THEN 1 ELSE 0 END) as underMaintenance,
        SUM(CASE WHEN status = 'Decommissioned' THEN 1 ELSE 0 END) as decommissioned
      FROM equipment
    `);

    const stats = counts[0] || {
      total: 0,
      active: 0,
      underMaintenance: 0,
      decommissioned: 0,
    };
    res.json({
      status: "success",
      stats: {
        total: stats.total || 0,
        active: stats.active || 0,
        underMaintenance: stats.underMaintenance || 0,
        decommissioned: stats.decommissioned || 0,
      },
    });

    // res.json({
    //   message: 'TODO: Implement GET /api/stats',
    //   stats: {
    //     total: 0,
    //     active: 0,
    //     underMaintenance: 0,
    //     decommissioned: 0,
    //   },
    // });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

module.exports = router;
