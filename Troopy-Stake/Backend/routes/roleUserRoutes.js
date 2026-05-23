const express = require("express");
const router = express.Router();

const Role = require("../models/Role");
const AdminUser = require("../models/AdminUser");

router.get("/roles", async (req, res) => {
  const roles = await Role.find().sort({ createdAt: 1 });
  res.json(roles);
});

router.post("/roles", async (req, res) => {
  const role = await Role.create(req.body);
  res.json(role);
});

router.put("/roles/:id", async (req, res) => {
  const role = await Role.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(role);
});

router.delete("/roles/:id", async (req, res) => {
  await Role.findByIdAndDelete(req.params.id);
  res.json({ message: "Role deleted" });
});

router.get("/users", async (req, res) => {
  const users = await AdminUser.find().sort({ createdAt: -1 });
  res.json(users);
});

router.post("/users", async (req, res) => {
  const user = await AdminUser.create(req.body);
  res.json(user);
});

router.put("/users/:id", async (req, res) => {
  const user = await AdminUser.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(user);
});

router.patch("/users/:id/status", async (req, res) => {
  const user = await AdminUser.findById(req.params.id);
  user.status = !user.status;
  await user.save();
  res.json(user);
});

router.delete("/users/:id", async (req, res) => {
  await AdminUser.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

module.exports = router;