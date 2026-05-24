const express = require("express");

const router = express.Router();

const Role = require("../models/Role");
const AdminUser = require("../models/AdminUser");



/* =========================
   ROLE ROUTES
========================= */

// GET ALL ROLES
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


// CREATE ROLE
router.post("/roles", async (req, res) => {
  try {
    const role = await Role.create(req.body);

    res.json(role);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});


// UPDATE ROLE
router.put("/roles/:id", async (req, res) => {
  try {
    const role =
      await Role.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json(role);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});


// DELETE ROLE
router.delete("/roles/:id", async (req, res) => {
  try {
    await Role.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Role Deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});



/* =========================
   USER ROUTES
========================= */


// GET ALL USERS
router.get("/users", async (req, res) => {
  try {
    const users =
      await AdminUser.find().sort({
        createdAt: -1,
      });

    res.json(users);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});



// CREATE USER
router.post("/users", async (req, res) => {
  try {
    const user =
      await AdminUser.create(req.body);

    res.json(user);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});



// UPDATE USER
router.put("/users/:id", async (req, res) => {
  try {
    const user =
      await AdminUser.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json(user);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});




// ENABLE / DISABLE USER
router.patch(
  "/users/:id/status",
  async (req, res) => {
    try {
      const user =
        await AdminUser.findById(
          req.params.id
        );

      user.status = !user.status;

      await user.save();

      res.json(user);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);




// DELETE USER
router.delete("/users/:id", async (req, res) => {
  try {
    await AdminUser.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "User Deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});



module.exports = router;