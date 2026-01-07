import { useContext } from "react";
import AuthContext from "./AuthContext";   
import { Navigate } from "react-router-dom";

export const RouteProtect = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
};
