const Transaction = require("../models/Transaction");

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTransaction = async (req, res) => {
  const { type, category, amount, date, note } = req.body;
  try {
    const transaction = await Transaction.create({ type, category, amount, date, note });
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });
    res.json({ message: "Transaction removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const transactions = await Transaction.find();

    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const netBalance = totalIncome - totalExpense;

    // Build last 6 months data
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const month = d.toLocaleString("default", { month: "short" });
      const year = d.getFullYear();
      const monthStr = `${year}-${String(d.getMonth() + 1).padStart(2, "0")}`;

      const income = transactions
        .filter((t) => t.type === "income" && t.date.startsWith(monthStr))
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = transactions
        .filter((t) => t.type === "expense" && t.date.startsWith(monthStr))
        .reduce((sum, t) => sum + t.amount, 0);

      months.push({ month, income, expense });
    }

    res.json({ totalIncome, totalExpense, netBalance, monthly: months });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};