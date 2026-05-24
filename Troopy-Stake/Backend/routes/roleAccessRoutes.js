const express = require("express");

const router = express.Router();

const Role = require("../models/Role");



/* =========================================
   GET ALL ROLES
========================================= */

router.get("/roles", async (req, res) => {
  try {
    const roles = await Role.find().sort({
      createdAt: -1,
    });

    res.json(roles);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});



/* =========================================
   CREATE ROLE
========================================= */

router.post("/roles", async (req, res) => {
  try {
    const existingRoleName = await Role.findOne({
      roleName: req.body.roleName,
    });

    if (existingRoleName) {
      return res.status(400).json({
        message: "Role name already exists",
      });
    }

    const existingRoleCode = await Role.findOne({
      roleCode: req.body.roleCode,
    });

    if (existingRoleCode) {
      return res.status(400).json({
        message: "Role code already exists",
      });
    }

    const role = await Role.create(req.body);

    res.json(role);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});



/* =========================================
   UPDATE ROLE
========================================= */

router.put("/roles/:id", async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.json(role);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});



/* =========================================
   ENABLE / DISABLE ROLE
========================================= */

router.patch(
  "/roles/:id/status",
  async (req, res) => {
    try {
      const role = await Role.findById(
        req.params.id
      );

      if (!role) {
        return res.status(404).json({
          message: "Role not found",
        });
      }

      role.status = !role.status;

      await role.save();

      res.json(role);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);



/* =========================================
   DELETE ROLE
========================================= */

router.delete("/roles/:id", async (req, res) => {
  try {
    await Role.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Role deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});



module.exports = router;