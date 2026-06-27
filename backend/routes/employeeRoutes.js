const express = require("express");
const router = express.Router();
const {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", protect, getEmployees);
router.post("/", protect, createEmployee);
router.put("/:id", protect, updateEmployee);
router.delete("/:id", protect, adminOnly, deleteEmployee);

module.exports = router;