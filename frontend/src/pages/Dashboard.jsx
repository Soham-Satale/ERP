import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:5000/api";

export default function Dashboard() {
  const { user } = useAuth();
  const token = JSON.parse(localStorage.getItem("user"))?.token;
  const headers = { Authorization: `Bearer ${token}` };

  const [stats, setStats] = useState([
    { label: "Employees", value: "—" },
    { label: "Net balance", value: "—" },
    { label: "Next month forecast", value: "—" },
  ]);

  const [recentAttendance, setRecentAttendance] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const [employees, summary, forecast, attendance, transactions] = await Promise.all([
        axios.get(`${API}/employees`, { headers }),
        axios.get(`${API}/finance/summary`, { headers }),
        axios.get(`${API}/forecast/expense`, { headers }),
        axios.get(`${API}/attendance?date=${today}`, { headers }),
        axios.get(`${API}/finance/transactions`, { headers }),
      ]);

      const presentCount = attendance.data.filter((a) => a.status === "present").length;
      const absentCount = attendance.data.filter((a) => a.status === "absent").length;

      setStats([
          { label: "Employees", value: employees.data.length },
          { label: "Net balance", value: `₹${summary.data.netBalance.toLocaleString("en-IN")}` },
          { label: "Next month forecast", value: `₹${forecast.data.predictedNextMonth.toLocaleString("en-IN")}` },
        ]);

        setRecentAttendance(attendance.data.slice(0, 5));
        setRecentTransactions(transactions.data.slice(0, 5));
    } catch (err) {
      console.error(err);
    }
  };

  const statusStyle = (status) => {
    if (status === "present") return { color: "#4A7C59", background: "#EAF2EC", padding: "2px 10px", borderRadius: "4px", fontSize: "12px", fontWeight: 500 };
    return { color: "#A8453B", background: "#FAECEB", padding: "2px 10px", borderRadius: "4px", fontSize: "12px", fontWeight: 500 };
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-tight" style={{ color: "#1A1A18" }}>Overview</h1>
        <p className="text-sm font-normal mt-0.5" style={{ color: "#8A8780" }}>Welcome back, {user?.name}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="px-5 py-4 transition-all duration-150 cursor-default"
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
            <p className="text-2xl font-bold mt-1 tracking-tight" style={{ color: "#1A1A18" }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Attendance count */}
      <div className="flex gap-3 mb-6">
        <div
          className="px-4 py-2 flex items-center gap-2"
          style={{ border: "1px solid #E5E3DD", borderRadius: "6px", background: "#FFFFFF" }}
        >
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4A7C59" }} />
          <p className="text-sm font-medium" style={{ color: "#1A1A18" }}>
            {recentAttendance.filter((a) => a.status === "present").length} Present today
          </p>
        </div>
        <div
          className="px-4 py-2 flex items-center gap-2"
          style={{ border: "1px solid #E5E3DD", borderRadius: "6px", background: "#FFFFFF" }}
        >
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#A8453B" }} />
          <p className="text-sm font-medium" style={{ color: "#1A1A18" }}>
            {recentAttendance.filter((a) => a.status === "absent").length} Absent today
          </p>
        </div>
      </div>

      {/* Bottom sections */}
      <div className="grid grid-cols-2 gap-4">
        {/* Recent Attendance */}
        <div
          className="px-5 py-4 transition-all duration-150"
          style={{ border: "1px solid #E5E3DD", borderRadius: "8px", background: "#FFFFFF" }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#D9D6CC")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#E5E3DD")}
        >
          <p className="text-sm bg-gray-200 rounded-s-md p-3 font-bold mt-2 mb-5" style={{ color: "#1A1A18" }}>Today's Attendance</p>
          {recentAttendance.length === 0 ? (
            <p className="text-sm font-normal" style={{ color: "#8A8780" }}>No attendance marked today.</p>
          ) : (
            <div className="space-y-2">
              {recentAttendance.map((a) => (
                <div key={a._id} className="flex items-center justify-between">
                  <p className="text-sm font-medium" style={{ color: "#1A1A18" }}>{a.employeeName}</p>
                  <span style={statusStyle(a.status)}>{a.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div
          className="px-5 py-4 transition-all duration-150"
          style={{ border: "1px solid #E5E3DD", borderRadius: "8px", background: "#FFFFFF" }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#D9D6CC")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#E5E3DD")}
        >
          <p className="text-sm  bg-gray-200 rounded-s-md p-3 font-bold mb-5 mt-2" style={{ color: "#1A1A18" }}>Recent Transactions</p>
          {recentTransactions.length === 0 ? (
            <p className="text-sm font-normal" style={{ color: "#8A8780" }}>No transactions yet.</p>
          ) : (
            <div className="space-y-2">
              {recentTransactions.map((t) => (
                <div key={t._id} className="flex items-center justify-between">
                  <p className="text-sm font-medium" style={{ color: "#1A1A18" }}>{t.category}</p>
                  <p className="text-sm font-bold" style={{ color: t.type === "income" ? "#4A7C59" : "#A8453B" }}>
                    {t.type === "income" ? "+" : "-"}₹{Number(t.amount).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}