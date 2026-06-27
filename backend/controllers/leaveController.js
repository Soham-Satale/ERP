const Leave = require("../models/Leave");

exports.applyLeave = async (req, res) => {
  const { employeeId, fromDate, toDate, reason } = req.body;
  try {
    const leave = await Leave.create({ employeeId, fromDate, toDate, reason });
    res.status(201).json(leave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("employeeId", "name department")
      .sort({ createdAt: -1 });
    const result = leaves.map((l) => ({
      _id: l._id,
      employeeId: l.employeeId._id,
      employeeName: l.employeeId.name,
      department: l.employeeId.department,
      fromDate: l.fromDate,
      toDate: l.toDate,
      reason: l.reason,
      status: l.status,
      createdAt: l.createdAt,
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateLeave = async (req, res) => {
  const { status } = req.body;
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!leave) return res.status(404).json({ message: "Leave not found" });
    res.json(leave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};