import { Navigate, useLocation } from "react-router-dom";

/**
 * Redirects unauthenticated users to /login, preserving the
 * intended destination in location.state.from so Login can
 * redirect back after a successful sign-in.
 */
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("user");

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;