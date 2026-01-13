import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const isAuth = sessionStorage.getItem("isAuth");

  if (!isAuth) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
