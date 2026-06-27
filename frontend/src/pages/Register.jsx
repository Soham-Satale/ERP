import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "employee" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post(import.meta.env.VITE_API_URL + "/api/auth/register", form)
      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#FAFAF8" }}>
      {/* Left panel */}
      <div
        className="hidden md:flex w-1/2 flex-col justify-between p-12"
        style={{ background: "#1A1A18" }}
      >
        <div className="flex items-center gap-2">
          <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: "#B8860B" }} />
          <p className="text-sm font-medium" style={{ color: "#FAFAF8" }}>Atlas ERP</p>
        </div>
        <div>
          <p className="text-3xl font-bold leading-snug mb-3" style={{ color: "#FAFAF8" }}>
            Internal operations,<br />simplified.
          </p>
          <p className="text-sm font-normal" style={{ color: "#8A8780" }}>
            Manage your team, finances, and forecasts — all in one place.
          </p>
        </div>
        <p className="text-xs" style={{ color: "#4A4A46" }}>Atlas ERP · Internal system</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight mb-1" style={{ color: "#1A1A18" }}>
              Create account
            </h1>
            <p className="text-sm font-normal" style={{ color: "#8A8780" }}>
              Set up your Atlas ERP account
            </p>
          </div>

          {error && (
            <div
              className="mb-4 px-4 py-2 text-sm font-medium"
              style={{ background: "#FAECEB", color: "#A8453B", borderRadius: "6px" }}
            >
              {error}
            </div>
          )}

          <div className="space-y-3">
            {[
              { key: "name", label: "Full Name", type: "text", placeholder: "Soham Satale" },
              { key: "email", label: "Email", type: "email", placeholder: "you@example.com" },
              { key: "password", label: "Password", type: "password", placeholder: "••••••••" },
            ].map((field) => (
              <div key={field.key}>
                <label className="text-xs font-semibold block mb-1" style={{ color: "#1A1A18" }}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.key]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm outline-none transition-all"
                  style={{
                    border: "1px solid #E5E3DD",
                    borderRadius: "6px",
                    background: "#FFFFFF",
                    color: "#1A1A18",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#B8860B")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E3DD")}
                />
              </div>
            ))}

            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: "#1A1A18" }}>
                Role
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-3 py-2.5 text-sm outline-none"
                style={{
                  border: "1px solid #E5E3DD",
                  borderRadius: "6px",
                  background: "#FFFFFF",
                  color: "#1A1A18",
                }}
              >
                <option value="employee">Employee</option>
                <option value="hr">HR</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-2.5 text-sm font-semibold transition-all duration-150"
              style={{
                background: "#1A1A18",
                color: "#FAFAF8",
                borderRadius: "6px",
                marginTop: "4px",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#B8860B")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#1A1A18")}
            >
              {loading ? "Creating..." : "Create account"}
            </button>
          </div>

          <p className="text-sm font-normal text-center mt-6" style={{ color: "#8A8780" }}>
            Already have an account?{" "}
            <Link to="/login" className="font-semibold" style={{ color: "#B8860B" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}