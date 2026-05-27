const express = require("express");
const router = express.Router();
const controller = require("../controllers/counsellorController");

router.post("/login", controller.login);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);
router.patch("/:id/status", controller.toggleStatus);

module.exports = router;
