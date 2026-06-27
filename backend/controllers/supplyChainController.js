const PurchaseOrder = require("../models/PurchaseOrder");

exports.getPurchaseOrders = async (req, res) => {
  try {
    const orders = await PurchaseOrder.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createPurchaseOrder = async (req, res) => {
  const { supplier, item, quantity, amount, date, note } = req.body;
  try {
    const order = await PurchaseOrder.create({
      supplier, item, quantity, amount, date, note,
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePurchaseOrderStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const order = await PurchaseOrder.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePurchaseOrder = async (req, res) => {
  try {
    const order = await PurchaseOrder.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Purchase order removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};