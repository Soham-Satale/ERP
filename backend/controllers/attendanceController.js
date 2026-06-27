const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");

exports.markAttendance = async (req, res) => {
  const { employeeId, date, status } = req.body;
  try {
    const existing = await Attendance.findOne({ employeeId, date });
    if (existing) {
      existing.status = status;
      await existing.save();
      return res.json(existing);
    }
    const record = await Attendance.create({ employeeId, date, status });
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAttendance = async (req, res) => {
  const { date } = req.query;
  try {
    const records = await Attendance.find({ date }).populate("employeeId", "name department");
    const result = records.map((r) => ({
      _id: r._id,
      employeeId: r.employeeId._id,
      employeeName: r.employeeId.name,
      department: r.employeeId.department,
      date: r.date,
      status: r.status,
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};