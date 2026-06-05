const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");

router.get("/", invoiceController.getAll);
router.get("/stats", invoiceController.getStats);
router.get("/generate-number", invoiceController.generateInvoiceNumber);
router.get("/:id", invoiceController.getById);
router.post("/", invoiceController.create);
router.put("/:id", invoiceController.update);
router.delete("/:id", invoiceController.remove);

module.exports = router;
