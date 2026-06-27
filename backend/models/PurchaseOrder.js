const mongoose = require("mongoose");

const purchaseOrderSchema = new mongoose.Schema(
  {
    supplier: { type: String, required: true },
    item: { type: String, required: true },
    quantity: { type: Number, required: true },
    amount: { type: Number, required: true },
    date: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "delivered"],
      default: "pending",
    },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PurchaseOrder", purchaseOrderSchema);