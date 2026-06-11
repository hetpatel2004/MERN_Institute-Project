const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/loginApprovalController");

router.get("/", ctrl.getAll);
router.get("/stats", ctrl.getStats);
router.get("/:id", ctrl.getById);
router.post("/", ctrl.create);
router.put("/:id/approve", ctrl.approve);
router.put("/:id/reject", ctrl.reject);
router.delete("/:id", ctrl.remove);

module.exports = router;
