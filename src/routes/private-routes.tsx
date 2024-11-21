import { AuthContext } from "@/contexts/auth-context";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoutes = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/sign-in" replace />;
};
