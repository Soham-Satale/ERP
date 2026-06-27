import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:5000/api";

export default function SupplyChain() {
  const { user } = useAuth();
  const token = JSON.parse(localStorage.getItem("user"))?.token;
  const headers = { Authorization: `Bearer ${token}` };

  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    supplier: "", item: "", quantity: "", amount: "", date: "", note: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data } = await axios.get(`${API}/supplychain`, { headers });
    setOrders(data);
  };

  const handleAdd = async () => {
    if (!form.supplier || !form.item || !form.quantity || !form.amount || !form.date) {
      setError("All fields except note are required");
      return;
    }
    try {
      await axios.post(`${API}/supplychain`, {
        ...form,
        quantity: Number(form.quantity),
        amount: Number(form.amount),
      }, { headers });
      setForm({ supplier: "", item: "", quantity: "", amount: "", date: "", note: "" });
      setShowForm(false);
      setError("");
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create order");
    }
  };

  const handleStatusUpdate = async (id, status) => {
    await axios.put(`${API}/supplychain/${id}`, { status }, { headers });
    fetchOrders();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this purchase order?")) return;
    await axios.delete(`${API}/supplychain/${id}`, { headers });
    fetchOrders();
  };

  const statusStyle = (status) => {
    if (status === "delivered") return { color: "#4A7C59", background: "#EAF2EC", padding: "2px 10px", borderRadius: "4px", fontSize: "12px", fontWeight: 500 };
    if (status === "approved") return { color: "#3D5A80", background: "#E8EEF4", padding: "2px 10px", borderRadius: "4px", fontSize: "12px", fontWeight: 500 };
    return { color: "#7A6A3B", background: "#FBF0D9", padding: "2px 10px", borderRadius: "4px", fontSize: "12px", fontWeight: 500 };
  };

  const statusFlow = { pending: "approved", approved: "delivered" };

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight" style={{ color: "#1A1A18" }}>
            Supply Chain
          </h1>
          <p className="text-sm font-normal mt-0.5" style={{ color: "#8A8780" }}>
            Manage purchase orders and supplier transactions
          </p>
        </div>
        {user?.role !== "employee" && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-sm font-medium px-4 py-2 transition-all duration-150"
            style={{ background: "#1A1A18", color: "#FAFAF8", borderRadius: "6px" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#B8860B")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#1A1A18")}
          >
            {showForm ? "Cancel" : "+ New Order"}
          </button>
        )}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Orders", value: orders.length },
          { label: "Pending", value: orders.filter((o) => o.status === "pending").length },
          { label: "Delivered", value: orders.filter((o) => o.status === "delivered").length },
        ].map((stat) => (
          <div
            key={stat.label}
            className="px-5 py-4 transition-all duration-150"
            style={{
              border: "1px solid #E5E3DD",
              borderTop: "2px solid #B8860B",
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
            <p className="text-2xl font-bold mt-1 tracking-tight" style={{ color: "#1A1A18" }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Add Order Form */}
      {showForm && (
        <div
          className="mb-6 p-5"
          style={{ border: "1px solid #E5E3DD", borderRadius: "8px", background: "#FFFFFF" }}
        >
          <p className="text-sm font-semibold mb-4" style={{ color: "#1A1A18" }}>New Purchase Order</p>
          {error && <p className="text-xs mb-3" style={{ color: "#A8453B" }}>{error}</p>}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { key: "supplier", placeholder: "Supplier name" },
              { key: "item", placeholder: "Item description" },
              { key: "quantity", placeholder: "Quantity", type: "number" },
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
                style={{
                  border: "1px solid #E5E3DD",
                  borderRadius: "6px",
                  background: "#FAFAF8",
                  color: "#1A1A18",
                }}
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
            Create Order
          </button>
        </div>
      )}

      {/* Orders Table */}
      <div style={{ border: "1px solid #E5E3DD", borderRadius: "8px", background: "#FFFFFF", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E5E3DD", background: "#FAFAF8" }}>
              {["Date", "Supplier", "Item", "Qty", "Amount", "Note", "Status", "Actions"].map((h) => (
                <th key={h} className="text-xs font-semibold text-left px-4 py-3" style={{ color: "#8A8780" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr
                key={order._id}
                style={{ borderBottom: i < orders.length - 1 ? "1px solid #E5E3DD" : "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAF8")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td className="px-4 py-3 text-sm" style={{ color: "#6B6863" }}>{order.date}</td>
                <td className="px-4 py-3 text-sm font-medium" style={{ color: "#1A1A18" }}>{order.supplier}</td>
                <td className="px-4 py-3 text-sm" style={{ color: "#6B6863" }}>{order.item}</td>
                <td className="px-4 py-3 text-sm" style={{ color: "#6B6863" }}>{order.quantity}</td>
                <td className="px-4 py-3 text-sm font-bold" style={{ color: "#1A1A18" }}>
                  ₹{Number(order.amount).toLocaleString("en-IN")}
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: "#6B6863" }}>{order.note || "—"}</td>
                <td className="px-4 py-3">
                  <span style={statusStyle(order.status)}>{order.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {statusFlow[order.status] && user?.role !== "employee" && (
                      <button
                        onClick={() => handleStatusUpdate(order._id, statusFlow[order.status])}
                        className="text-xs font-medium px-3 py-1 transition-all"
                        style={{ background: "#E8EEF4", color: "#3D5A80", borderRadius: "4px" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#3D5A80") || (e.currentTarget.style.color = "#fff")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "#E8EEF4") || (e.currentTarget.style.color = "#3D5A80")}
                      >
                        Mark {statusFlow[order.status]}
                      </button>
                    )}
                    {user?.role === "admin" && (
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="text-xs font-medium transition-colors"
                        style={{ color: "#A8453B" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#7A2E28")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#A8453B")}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-sm text-center" style={{ color: "#8A8780" }}>
                  No purchase orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}