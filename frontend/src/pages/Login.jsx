import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post(import.meta.env.VITE_API_URL + "/api/auth/login", form);
      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
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
              Sign in
            </h1>
            <p className="text-sm font-normal" style={{ color: "#8A8780" }}>
              Enter your credentials to continue
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
            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: "#1A1A18" }}>
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
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

            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: "#1A1A18" }}>
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
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
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <p className="text-sm font-normal text-center mt-6" style={{ color: "#8A8780" }}>
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold" style={{ color: "#B8860B" }}>
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}