import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoutes = () => {
  const { isAuthenticated, isTokenLoading } = useAuth();

  if (isTokenLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/sign-in" replace />;
};
