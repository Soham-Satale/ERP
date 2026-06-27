const express = require("express");
const router = express.Router();
const {
  getTransactions,
  createTransaction,
  deleteTransaction,
  getSummary,
} = require("../controllers/financeController");
const { protect } = require("../middleware/authMiddleware");

router.get("/transactions", protect, getTransactions);
router.post("/transactions", protect, createTransaction);
router.delete("/transactions/:id", protect, deleteTransaction);
router.get("/summary", protect, getSummary);

module.exports = router;