const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["income", "expense"], required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: String, required: true },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);