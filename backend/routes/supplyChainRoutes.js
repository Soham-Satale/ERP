const express = require("express");
const router = express.Router();
const {
  getPurchaseOrders,
  createPurchaseOrder,
  updatePurchaseOrderStatus,
  deletePurchaseOrder,
} = require("../controllers/supplyChainController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", protect, getPurchaseOrders);
router.post("/", protect, createPurchaseOrder);
router.put("/:id", protect, updatePurchaseOrderStatus);
router.delete("/:id", protect, adminOnly, deletePurchaseOrder);

module.exports = router;