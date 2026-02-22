import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/unauthorized" replace />;

  try {
    const decoded = jwtDecode(token);
    const { role, exp } = decoded;

    const currentTime = Date.now() / 1000; // in seconds

    // Check expiration
    if (exp && exp < currentTime) {
      localStorage.removeItem("token"); // optional: clear expired token
      return <Navigate to="/" replace />;
    }

    // Check role
    if (requiredRole && role !== requiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }

    return children;
  } catch (error) {
    console.error("Invalid token:", error);
    localStorage.removeItem("token");
    return <Navigate to="/" replace />;
  }
}
