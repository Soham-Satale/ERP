import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from "recharts";

import API from "../api";

export default function Finance() {
  const token = JSON.parse(localStorage.getItem("user"))?.token;
  const headers = { Authorization: `Bearer ${token}` };

  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: "income", category: "", amount: "", date: "", note: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTransactions();
    fetchSummary();
  }, []);

  const fetchTransactions = async () => {
    const { data } = await axios.get(`${API}/finance/transactions`, { headers });
    setTransactions(data);
  };

  const fetchSummary = async () => {
    const { data } = await axios.get(`${API}/finance/summary`, { headers });
    setSummary(data);
  };

  const handleAdd = async () => {
    if (!form.category || !form.amount || !form.date) {
      setError("Category, amount and date are required");
      return;
    }
    try {
      await axios.post(`${API}/finance/transactions`, { ...form, amount: Number(form.amount) }, { headers });
      setForm({ type: "income", category: "", amount: "", date: "", note: "" });
      setShowForm(false);
      setError("");
      fetchTransactions();
      fetchSummary();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add transaction");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    await axios.delete(`${API}/finance/transactions/${id}`, { headers });
    fetchTransactions();
    fetchSummary();
  };

  const formatAmount = (amount) =>
    `₹${Number(amount).toLocaleString("en-IN")}`;

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight" style={{ color: "#1A1A18" }}>Finance</h1>
          <p className="text-sm font-normal mt-0.5" style={{ color: "#8A8780" }}>Track income, expenses and financial trends</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm font-medium px-4 py-2 transition-all duration-150"
          style={{ background: "#1A1A18", color: "#FAFAF8", borderRadius: "6px" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#B8860B")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#1A1A18")}
        >
          {showForm ? "Cancel" : "+ Add Transaction"}
        </button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Income", value: formatAmount(summary.totalIncome), color: "#4A7C59" },
            { label: "Total Expense", value: formatAmount(summary.totalExpense), color: "#A8453B" },
            { label: "Net Balance", value: formatAmount(summary.netBalance), color: "#B8860B" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="px-5 py-4 transition-all duration-150"
              style={{
                border: "1px solid #E5E3DD",
                borderTop: `2px solid ${stat.color}`,
                borderRadius: "8px",
                background: "#FFFFFF",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(26,26,24,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <p className="text-xs font-medium" style={{ color: "#8A8780" }}>{stat.label}</p>
              <p className="text-2xl font-bold mt-1 tracking-tight" style={{ color: stat.color }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Add Transaction Form */}
      {showForm && (
        <div className="mb-6 p-5" style={{ border: "1px solid #E5E3DD", borderRadius: "8px", background: "#FFFFFF" }}>
          <p className="text-sm font-semibold mb-4" style={{ color: "#1A1A18" }}>New Transaction</p>
          {error && <p className="text-xs mb-3" style={{ color: "#A8453B" }}>{error}</p>}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="px-3 py-2 text-sm outline-none"
              style={{ border: "1px solid #E5E3DD", borderRadius: "6px", background: "#FAFAF8", color: "#1A1A18" }}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            {[
              { key: "category", placeholder: "Category" },
              { key: "amount", placeholder: "Amount (₹)", type: "number" },
              { key: "date", placeholder: "Date", type: "date" },
              { key: "note", placeholder: "Note (optional)" },
            ].map((field) => (
              <input
                key={field.key}
                type={field.type || "text"}
                placeholder={field.placeholder}
                value={form[field.key]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                className="px-3 py-2 text-sm outline-none"
                style={{ border: "1px solid #E5E3DD", borderRadius: "6px", background: "#FAFAF8", color: "#1A1A18" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#B8860B")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E3DD")}
              />
            ))}
          </div>
          <button
            onClick={handleAdd}
            className="text-sm font-medium px-4 py-2"
            style={{ background: "#B8860B", color: "#FFFFFF", borderRadius: "6px" }}
          >
            Add Transaction
          </button>
        </div>
      )}

      {/* Chart */}
      {summary?.monthly && (
        <div
          className="mb-6 p-5"
          style={{ border: "1px solid #E5E3DD", borderRadius: "8px", background: "#FFFFFF" }}
        >
          <p className="text-sm font-semibold mb-4" style={{ color: "#1A1A18" }}>Last 6 Months</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={summary.monthly} barSize={20}>
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#8A8780" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#8A8780" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ border: "1px solid #E5E3DD", borderRadius: "6px", fontSize: "12px" }}
                formatter={(value) => `₹${value.toLocaleString("en-IN")}`}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="income" fill="#4A7C59" radius={[3, 3, 0, 0]} name="Income" />
              <Bar dataKey="expense" fill="#A8453B" radius={[3, 3, 0, 0]} name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Transactions Table */}
      <div style={{ border: "1px solid #E5E3DD", borderRadius: "8px", background: "#FFFFFF", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E5E3DD", background: "#FAFAF8" }}>
              {["Date", "Type", "Category", "Note", "Amount", ""].map((h, i) => (
                <th key={i} className="text-xs font-semibold text-left px-4 py-3" style={{ color: "#8A8780" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, i) => (
              <tr
                key={t._id}
                style={{ borderBottom: i < transactions.length - 1 ? "1px solid #E5E3DD" : "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAF8")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td className="px-4 py-3 text-sm" style={{ color: "#6B6863" }}>{t.date}</td>
                <td className="px-4 py-3">
                  <span style={{
                    fontSize: "12px", fontWeight: 500, padding: "2px 10px", borderRadius: "4px",
                    background: t.type === "income" ? "#EAF2EC" : "#FAECEB",
                    color: t.type === "income" ? "#4A7C59" : "#A8453B",
                  }}>
                    {t.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-medium" style={{ color: "#1A1A18" }}>{t.category}</td>
                <td className="px-4 py-3 text-sm" style={{ color: "#6B6863" }}>{t.note || "—"}</td>
                <td className="px-4 py-3 text-sm font-bold" style={{ color: t.type === "income" ? "#4A7C59" : "#A8453B" }}>
                  {t.type === "income" ? "+" : "-"}{formatAmount(t.amount)}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="text-xs font-medium transition-colors"
                    style={{ color: "#A8453B" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#7A2E28")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#A8453B")}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-sm text-center" style={{ color: "#8A8780" }}>No transactions yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}