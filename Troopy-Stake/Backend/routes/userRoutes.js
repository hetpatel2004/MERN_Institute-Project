const express = require("express");

const router = express.Router();

const User = require("../models/User");


// GET USERS
router.get("/", async (req, res) => {
  const users = await User.find();

  res.json(users);
});


// ADD USER
router.post("/", async (req, res) => {
  const user = new User(req.body);

  await user.save();

  res.json(user);
});


// UPDATE USER
router.put("/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(user);
});


// DELETE USER
router.delete("/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);

  res.json({
    message: "User Deleted",
  });
});

module.exports = router;