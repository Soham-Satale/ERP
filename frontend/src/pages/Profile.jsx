import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  const fields = [
    { label: "Full Name", value: user?.name },
    { label: "Email", value: user?.email },
    { label: "Role", value: user?.role },
    { label: "User ID", value: user?._id },
  ];

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-tight" style={{ color: "#1A1A18" }}>Profile</h1>
        <p className="text-sm font-normal mt-0.5" style={{ color: "#8A8780" }}>Your account details</p>
      </div>

      <div className="max-w-lg">
        {/* Avatar */}
        <div
          className="flex items-center gap-4 p-5 mb-4"
          style={{ border: "1px solid #E5E3DD", borderRadius: "8px", background: "#FFFFFF" }}
        >
          <div
            className="flex items-center justify-center text-lg font-bold"
            style={{
              width: "52px", height: "52px", borderRadius: "50%",
              background: "#FBF0D9", color: "#B8860B",
              border: "2px solid #B8860B",
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-base font-bold" style={{ color: "#1A1A18" }}>{user?.name}</p>
            <p className="text-sm font-normal capitalize" style={{ color: "#8A8780" }}>{user?.role} · Atlas ERP</p>
          </div>
        </div>

        {/* Details */}
        <div
          style={{ border: "1px solid #E5E3DD", borderRadius: "8px", background: "#FFFFFF", overflow: "hidden" }}
        >
          {fields.map((field, i) => (
            <div
              key={field.label}
              className="px-5 py-4 flex items-center justify-between"
              style={{ borderBottom: i < fields.length - 1 ? "1px solid #E5E3DD" : "none" }}
            >
              <p className="text-xs font-semibold" style={{ color: "#8A8780" }}>{field.label}</p>
              <p className="text-sm font-medium capitalize" style={{ color: "#1A1A18" }}>{field.value}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}