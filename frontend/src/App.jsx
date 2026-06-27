import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import HR from "./pages/HR";
import Finance from "./pages/Finance";
import Forecast from "./pages/Forecast";
import Profile from "./pages/Profile";
import SupplyChain from "./pages/SupplyChain";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/hr" element={<ProtectedRoute><HR /></ProtectedRoute>} />
          <Route path="/finance" element={<ProtectedRoute><Finance /></ProtectedRoute>} />
          <Route path="/forecast" element={<ProtectedRoute><Forecast /></ProtectedRoute>} />
          <Route path="/supplychain" element={<ProtectedRoute><SupplyChain /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}