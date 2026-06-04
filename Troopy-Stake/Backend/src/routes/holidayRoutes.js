const express = require("express");
const router = express.Router();
const controller = require("../controllers/holidayController");

router.get("/", controller.getAll);
router.get("/stats", controller.getStats);
router.get("/upcoming", controller.getUpcoming);
router.get("/notifications", controller.getNotifications);
router.get("/notifications/:holidayId", controller.getNotificationLogs);
router.get("/role-counts", controller.getRoleCounts);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.post("/preload", controller.preloadHolidays);
router.post("/bulk", controller.bulkCreate);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
