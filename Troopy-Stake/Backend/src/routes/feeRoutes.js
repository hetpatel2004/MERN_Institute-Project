const express = require("express");
const router = express.Router();
const feeController = require("../controllers/feeController");

router.get("/", feeController.getAll);
router.get("/stats", feeController.getStats);
router.get("/:id", feeController.getById);
router.post("/", feeController.create);
router.put("/:id", feeController.update);
router.delete("/:id", feeController.remove);
router.post("/:feeId/payments", feeController.collectPayment);
router.get("/:feeId/payments", feeController.getPaymentHistory);

module.exports = router;
