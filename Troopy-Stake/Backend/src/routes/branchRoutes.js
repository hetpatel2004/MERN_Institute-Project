const express = require("express");
const router = express.Router();
const controller = require("../controllers/branchController");

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.get("/institute/:instituteId", controller.getByInstitute);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);
router.patch("/:id/status", controller.toggleStatus);
router.patch("/:id/reset-password", controller.resetPassword);

module.exports = router;
