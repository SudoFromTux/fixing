import { Navigate, useLocation } from "react-router-dom";
import { hasAuthSession } from "../utils/authSession";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isLoggedIn = hasAuthSession();
  const location = useLocation();

  if (!isLoggedIn && location.pathname !== "/auth") {
    return <Navigate to="/auth" replace />;
  }

  if (isLoggedIn && location.pathname === "/auth") {
    return <Navigate to="/dashboard" replace />;
  }

  // Allow access to the route
  return children;
};

export default ProtectedRoute;
