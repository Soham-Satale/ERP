import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { name: "Overview", path: "/dashboard" },
  { name: "Personnel", path: "/hr" },
  { name: "Finance", path: "/finance" },
  { name: "Supply Chain", path: "/supplychain" },
  { name: "Forecast", path: "/forecast" },
  { name: "Profile", path: "/profile" },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#FAFAF8" }}>
      {/* Sidebar */}
      <aside
        className="w-52 flex flex-col shrink-0"
        style={{ borderRight: "1px solid #E5E3DD" }}
      >
        <div className="px-5 py-5" style={{ borderBottom: "1px solid #E5E3DD" }}>
          <div className="flex items-center gap-2">
            <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: "#B8860B" }} />
            <p className="text-sm font-bold tracking-tight" style={{ color: "#1A1A18" }}>
              Atlas ERP
            </p>
          </div>
          <p className="text-xs mt-0.5 ml-[14px]" style={{ color: "#8A8780" }}>
            Internal system
          </p>
        </div>

        <nav className="flex-1 px-2 py-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="block px-3 py-2 text-sm mb-0.5 transition-colors"
                style={{
                  color: isActive ? "#1A1A18" : "#6B6863",
                  fontWeight: isActive ? 600 : 500,
                  background: isActive ? "#FBF0D9" : "transparent",
                  borderLeft: isActive ? "2px solid #B8860B" : "2px solid transparent",
                  borderRadius: "6px",
                }}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4" style={{ borderTop: "1px solid #E5E3DD" }}>
          <p className="text-xs px-3 mb-2" style={{ color: "#8A8780" }}>
            {user?.name} · <span style={{ textTransform: "capitalize" }}>{user?.role}</span>
          </p>
          <button
            onClick={handleLogout}
            className="text-xs px-3 py-1.5 w-full text-left transition-colors"
            style={{ color: "#6B6863", borderRadius: "6px" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#F0EFE9")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 px-8 py-6 overflow-auto">{children}</main>
    </div>
  );
}