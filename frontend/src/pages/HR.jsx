import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:5000/api";

export default function HR() {
  const { user } = useAuth();
  const token = JSON.parse(localStorage.getItem("user"))?.token;
  const headers = { Authorization: `Bearer ${token}` };

  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [activeTab, setActiveTab] = useState("employees");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [form, setForm] = useState({ name: "", email: "", department: "", role: "employee" });
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchEmployees();
    fetchLeaves();
    fetchAttendance();
  }, []);

const [leaveForm, setLeaveForm] = useState({ fromDate: "", toDate: "", reason: "" });
const [leaveError, setLeaveError] = useState("");

const handleApplyLeave = async () => {
  if (!leaveForm.fromDate || !leaveForm.toDate || !leaveForm.reason) {
    setLeaveError("All fields are required");
    return;
  }
  try {
    // Need employee's ID — find by logged in user's email
    const emp = employees.find((e) => e.email === user?.email);
    if (!emp) {
      setLeaveError("Your employee profile not found. Contact admin.");
      return;
    }
    await axios.post(`${API}/leaves`, {
      employeeId: emp._id,
      ...leaveForm,
    }, { headers });
    setLeaveForm({ fromDate: "", toDate: "", reason: "" });
    setLeaveError("");
    fetchLeaves();
  } catch (err) {
    setLeaveError(err.response?.data?.message || "Failed to submit");
  }
};

  const fetchEmployees = async () => {
    const { data } = await axios.get(`${API}/employees`, { headers });
    setEmployees(data);
  };

  const fetchLeaves = async () => {
    const { data } = await axios.get(`${API}/leaves`, { headers });
    setLeaves(data);
  };

  const fetchAttendance = async () => {
    const { data } = await axios.get(`${API}/attendance?date=${today}`, { headers });
    setAttendance(data);
  };

  const handleAddEmployee = async () => {
    if (!form.name || !form.email || !form.department) {
      setError("All fields are required");
      return;
    }
    try {
      await axios.post(`${API}/employees`, form, { headers });
      setForm({ name: "", email: "", department: "", role: "employee" });
      setShowForm(false);
      setError("");
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add employee");
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm("Remove this employee?")) return;
    await axios.delete(`${API}/employees/${id}`, { headers });
    fetchEmployees();
  };

  const handleEditClick = (emp) => {
    setEditingId(emp._id);
    setEditForm({ name: emp.name, email: emp.email, department: emp.department, role: emp.role });
  };

  const handleEditSave = async () => {
    await axios.put(`${API}/employees/${editingId}`, editForm, { headers });
    setEditingId(null);
    fetchEmployees();
  };


  const handleAttendance = async (employeeId, status) => {
    await axios.post(`${API}/attendance`, { employeeId, date: today, status }, { headers });
    fetchAttendance();
  };

  const handleLeaveStatus = async (id, status) => {
    await axios.put(`${API}/leaves/${id}`, { status }, { headers });
    fetchLeaves();
  };

  const getAttendanceStatus = (employeeId) => {
    const record = attendance.find((a) => a.employeeId === employeeId);
    return record?.status || null;
  };

  const statusStyle = (status) => {
    if (status === "present" || status === "approved") return { color: "#4A7C59", background: "#EAF2EC", padding: "2px 10px", borderRadius: "4px", fontSize: "12px", fontWeight: 500 };
    if (status === "absent" || status === "rejected") return { color: "#A8453B", background: "#FAECEB", padding: "2px 10px", borderRadius: "4px", fontSize: "12px", fontWeight: 500 };
    return { color: "#7A6A3B", background: "#FBF0D9", padding: "2px 10px", borderRadius: "4px", fontSize: "12px", fontWeight: 500 };
  };

  const tabs = ["employees", "attendance", "leaves"];

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight" style={{ color: "#1A1A18" }}>Personnel</h1>
          <p className="text-sm font-normal mt-0.5" style={{ color: "#8A8780" }}>Manage employees, attendance and leave requests</p>
        </div>
        {activeTab === "employees" && user?.role !== "employee" && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-sm font-medium px-4 py-2 transition-all duration-150"
            style={{ background: "#1A1A18", color: "#FAFAF8", borderRadius: "6px" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#B8860B")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#1A1A18")}
          >
            {showForm ? "Cancel" : "+ Add Employee"}
          </button>
        )}
      </div>

      {/* Add Employee Form */}
      {showForm && (
        <div className="mb-6 p-5" style={{ border: "1px solid #E5E3DD", borderRadius: "8px", background: "#FFFFFF" }}>
          <p className="text-sm font-semibold mb-4" style={{ color: "#1A1A18" }}>New Employee</p>
          {error && <p className="text-xs mb-3" style={{ color: "#A8453B" }}>{error}</p>}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { key: "name", placeholder: "Full name" },
              { key: "email", placeholder: "Email address" },
              { key: "department", placeholder: "Department" },
            ].map((field) => (
              <input
                key={field.key}
                type="text"
                placeholder={field.placeholder}
                value={form[field.key]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                className="px-3 py-2 text-sm outline-none"
                style={{ border: "1px solid #E5E3DD", borderRadius: "6px", background: "#FAFAF8", color: "#1A1A18" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#B8860B")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E3DD")}
              />
            ))}
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="px-3 py-2 text-sm outline-none"
              style={{ border: "1px solid #E5E3DD", borderRadius: "6px", background: "#FAFAF8", color: "#1A1A18" }}
            >
              <option value="employee">Employee</option>
              <option value="hr">HR</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            onClick={handleAddEmployee}
            className="text-sm font-medium px-4 py-2"
            style={{ background: "#B8860B", color: "#FFFFFF", borderRadius: "6px" }}
          >
            Add Employee
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-4" style={{ borderBottom: "1px solid #E5E3DD" }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2 text-sm capitalize transition-colors"
            style={{
              color: activeTab === tab ? "#1A1A18" : "#8A8780",
              fontWeight: activeTab === tab ? 600 : 400,
              borderBottom: activeTab === tab ? "2px solid #B8860B" : "2px solid transparent",
              marginBottom: "-1px",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Employees Tab */}
      {activeTab === "employees" && (
        <div style={{ border: "1px solid #E5E3DD", borderRadius: "8px", background: "#FFFFFF", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #E5E3DD", background: "#FAFAF8" }}>
                {["Name", "Email", "Department", "Role", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-xs font-semibold text-left px-4 py-3" style={{ color: "#8A8780" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, i) => (
                <tr
                  key={emp._id}
                  style={{ borderBottom: i < employees.length - 1 ? "1px solid #E5E3DD" : "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAF8")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: "#1A1A18" }}>
                      {editingId === emp._id ? (
                        <input
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="px-2 py-1 text-sm outline-none w-full"
                          style={{ border: "1px solid #B8860B", borderRadius: "4px", background: "#FAFAF8" }}
                        />
                      ) : emp.name}
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: "#6B6863" }}>
                      {editingId === emp._id ? (
                        <input
                          value={editForm.department}
                          onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                          className="px-2 py-1 text-sm outline-none w-full"
                          style={{ border: "1px solid #B8860B", borderRadius: "4px", background: "#FAFAF8" }}
                        />
                      ) : emp.department}
                  </td>
                  
                  <td className="px-4 py-3 text-sm" style={{ color: "#6B6863" }}>{emp.email}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: "#6B6863" }}>{emp.department}</td>
                  <td className="px-4 py-3 text-sm capitalize" style={{ color: "#6B6863" }}>{emp.role}</td>
                  <td className="px-4 py-3"><span style={statusStyle(emp.status)}>{emp.status}</span></td>
                  <td className="px-4 py-3">
                    {editingId === emp._id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={handleEditSave}
                          className="text-xs font-medium px-3 py-1"
                          style={{ background: "#EAF2EC", color: "#4A7C59", borderRadius: "4px" }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-xs font-medium px-3 py-1"
                          style={{ background: "#F0EFE9", color: "#6B6863", borderRadius: "4px" }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        {user?.role !== "employee" && (
                          <button
                            onClick={() => handleEditClick(emp)}
                            className="text-xs font-medium transition-colors"
                            style={{ color: "#B8860B" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "#8A6200")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "#B8860B")}
                          >
                            Edit
                          </button>
                        )}
                        {user?.role === "admin" && (
                          <button
                            onClick={() => handleDeleteEmployee(emp._id)}
                            className="text-xs font-medium transition-colors"
                            style={{ color: "#A8453B" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "#7A2E28")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "#A8453B")}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-6 text-sm text-center" style={{ color: "#8A8780" }}>No employees yet. Add one above.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Attendance Tab */}
      {activeTab === "attendance" && (
        <div style={{ border: "1px solid #E5E3DD", borderRadius: "8px", background: "#FFFFFF", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #E5E3DD", background: "#FAFAF8" }}>
                {["Name", "Department", "Today's Status", "Mark"].map((h) => (
                  <th key={h} className="text-xs font-semibold text-left px-4 py-3" style={{ color: "#8A8780" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, i) => {
                const status = getAttendanceStatus(emp._id);
                return (
                  <tr
                    key={emp._id}
                    style={{ borderBottom: i < employees.length - 1 ? "1px solid #E5E3DD" : "none" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAF8")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="px-4 py-3 text-sm font-medium" style={{ color: "#1A1A18" }}>
                      {editingId === emp._id ? (
                        <input
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="px-2 py-1 text-sm outline-none w-full"
                          style={{ border: "1px solid #B8860B", borderRadius: "4px", background: "#FAFAF8" }}
                        />
                      ) : emp.name}
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: "#6B6863" }}>
                      {editingId === emp._id ? (
                        <input
                          value={editForm.department}
                          onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                          className="px-2 py-1 text-sm outline-none w-full"
                          style={{ border: "1px solid #B8860B", borderRadius: "4px", background: "#FAFAF8" }}
                        />
                      ) : emp.department}
                    </td>
                    
                    <td className="px-4 py-3 text-sm" style={{ color: "#6B6863" }}>{emp.department}</td>
                    <td className="px-4 py-3">
                      {status ? <span style={statusStyle(status)}>{status}</span> : <span className="text-xs" style={{ color: "#8A8780" }}>Not marked</span>}
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => handleAttendance(emp._id, "present")}
                        className="text-xs font-medium px-3 py-1 transition-all"
                        style={{ background: "#EAF2EC", color: "#4A7C59", borderRadius: "4px" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#4A7C59") || (e.currentTarget.style.color = "#fff")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "#EAF2EC") || (e.currentTarget.style.color = "#4A7C59")}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => handleAttendance(emp._id, "absent")}
                        className="text-xs font-medium px-3 py-1 transition-all"
                        style={{ background: "#FAECEB", color: "#A8453B", borderRadius: "4px" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#A8453B") || (e.currentTarget.style.color = "#fff")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "#FAECEB") || (e.currentTarget.style.color = "#A8453B")}
                      >
                        Absent
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Leaves Tab */}

      {activeTab === "leaves" && user?.role === "employee" && (
        <div
          className="mb-4 p-5"
          style={{ border: "1px solid #E5E3DD", borderRadius: "8px", background: "#FFFFFF" }}
        >
          <p className="text-sm font-semibold mb-3" style={{ color: "#1A1A18" }}>Apply for Leave</p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: "#1A1A18" }}>From</label>
              <input
                type="date"
                value={leaveForm.fromDate}
                onChange={(e) => setLeaveForm({ ...leaveForm, fromDate: e.target.value })}
                className="w-full px-3 py-2 text-sm outline-none"
                style={{ border: "1px solid #E5E3DD", borderRadius: "6px", background: "#FAFAF8", color: "#1A1A18" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#B8860B")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E3DD")}
              />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: "#1A1A18" }}>To</label>
              <input
                type="date"
                value={leaveForm.toDate}
                onChange={(e) => setLeaveForm({ ...leaveForm, toDate: e.target.value })}
                className="w-full px-3 py-2 text-sm outline-none"
                style={{ border: "1px solid #E5E3DD", borderRadius: "6px", background: "#FAFAF8", color: "#1A1A18" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#B8860B")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E3DD")}
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold block mb-1" style={{ color: "#1A1A18" }}>Reason</label>
              <input
                type="text"
                placeholder="Reason for leave"
                value={leaveForm.reason}
                onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                className="w-full px-3 py-2 text-sm outline-none"
                style={{ border: "1px solid #E5E3DD", borderRadius: "6px", background: "#FAFAF8", color: "#1A1A18" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#B8860B")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E3DD")}
              />
            </div>
          </div>
          {leaveError && <p className="text-xs mb-2" style={{ color: "#A8453B" }}>{leaveError}</p>}
          <button
            onClick={handleApplyLeave}
            className="text-sm font-medium px-4 py-2"
            style={{ background: "#B8860B", color: "#FFFFFF", borderRadius: "6px" }}
          >
            Submit Leave Request
          </button>
        </div>
      )}
      {activeTab === "leaves" && (
        <div style={{ border: "1px solid #E5E3DD", borderRadius: "8px", background: "#FFFFFF", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #E5E3DD", background: "#FAFAF8" }}>
                {["Employee", "From", "To", "Reason", "Status", "Action"].map((h) => (
                  <th key={h} className="text-xs font-semibold text-left px-4 py-3" style={{ color: "#8A8780" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave, i) => (
                <tr
                  key={leave._id}
                  style={{ borderBottom: i < leaves.length - 1 ? "1px solid #E5E3DD" : "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAF8")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: "#1A1A18" }}>{leave.employeeName}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: "#6B6863" }}>{leave.fromDate}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: "#6B6863" }}>{leave.toDate}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: "#6B6863" }}>{leave.reason}</td>
                  <td className="px-4 py-3"><span style={statusStyle(leave.status)}>{leave.status}</span></td>
                  <td className="px-4 py-3">
                    {leave.status === "pending" && user?.role !== "employee" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleLeaveStatus(leave._id, "approved")}
                          className="text-xs font-medium px-3 py-1"
                          style={{ background: "#EAF2EC", color: "#4A7C59", borderRadius: "4px" }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleLeaveStatus(leave._id, "rejected")}
                          className="text-xs font-medium px-3 py-1"
                          style={{ background: "#FAECEB", color: "#A8453B", borderRadius: "4px" }}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {leaves.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-6 text-sm text-center" style={{ color: "#8A8780" }}>No leave requests yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}