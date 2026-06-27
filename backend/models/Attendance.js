const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    date: { type: String, required: true },
    status: { type: String, enum: ["present", "absent"], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);