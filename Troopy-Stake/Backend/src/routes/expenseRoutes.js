const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");

router.get("/", expenseController.getAll);
router.get("/stats", expenseController.getStats);
router.get("/:id", expenseController.getById);
router.post("/", expenseController.create);
router.put("/:id", expenseController.update);
router.delete("/:id", expenseController.remove);
router.put("/:id/approve", expenseController.approve);
router.put("/:id/reject", expenseController.reject);

module.exports = router;
