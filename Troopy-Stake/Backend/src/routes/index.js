const express = require("express");

const authRoutes = require("./authRoutes");
const instituteRoutes = require("./instituteRoutes");
const companyRoutes = require("./companyRoutes");
const branchRoutes = require("./branchRoutes");
const userRoutes = require("./userRoutes");
const courseRoutes = require("./courseRoutes");
const moduleRoutes = require("./moduleRoutes");
const branchAdminRoutes = require("./branchAdminRoutes");
const leadRoutes = require("./leadRoutes");
const followUpRoutes = require("./followUpRoutes");
const admissionRoutes = require("./admissionRoutes");
const studentRoutes = require("./studentRoutes");
const paymentRoutes = require("./paymentRoutes");
const batchRoutes = require("./batchRoutes");
const instituteCoursePurchaseRoutes = require("./instituteCoursePurchaseRoutes");
const counsellorRoutes = require("./counsellorRoutes");
const roleAccessRoutes = require("./roleAccessRoutes");
const roleUserRoutes = require("./roleUserRoutes");
const topicContentRoutes = require("./topicContentRoutes");
const campaignRoutes = require("./campaignRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/institutes", instituteRoutes);
router.use("/companies", companyRoutes);
router.use("/branches", branchRoutes);
router.use("/users", userRoutes);
router.use("/courses", courseRoutes);
router.use("/batches", batchRoutes);
router.use("/modules", moduleRoutes);
router.use("/branch-admin", branchAdminRoutes);
router.use("/leads", leadRoutes);
router.use("/follow-ups", followUpRoutes);
router.use("/admissions", admissionRoutes);
router.use("/students", studentRoutes);
router.use("/payments", paymentRoutes);
router.use("/institute-course-purchases", instituteCoursePurchaseRoutes);
router.use("/counsellors", counsellorRoutes);
router.use("/role-access", roleAccessRoutes);
router.use("/role-access", roleUserRoutes);
router.use("/topic-content", topicContentRoutes);
router.use("/campaigns", campaignRoutes);

module.exports = router;
