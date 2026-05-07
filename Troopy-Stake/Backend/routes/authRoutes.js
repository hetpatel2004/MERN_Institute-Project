const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    let { name, email, password, role, device, location } = req.body;

    // ❌ BLOCK superadmin registration from public
    if (role === "superadmin") {
      return res.status(403).json({
        message: "You are not allowed to register as Super Admin",
      });
    }

    // default role
    if (!role) role = "student";

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password, device, location } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const ipAddress =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress ||
      "";

    user.loginInfo = {
      ipAddress,
      device: device || req.headers["user-agent"] || "",
      location: location || {
        latitude: null,
        longitude: null,
      },
      loginTime: new Date(),
    };

    await user.save();



    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        institute_id: user.institute_id,
        branch_id: user.branch_id,
        company_id: user.company_id,
        menuAccess: user.menuAccess || [],
        loginInfo: user.loginInfo,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login error", error: error.message });
  }
});

module.exports = router;