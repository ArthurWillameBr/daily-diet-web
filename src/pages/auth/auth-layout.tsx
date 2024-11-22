import { Header } from "@/components/header";
import { useAuth } from "@/hooks/useAuth";
import { Outlet, useNavigate } from "react-router-dom";

export function AuthLayout() {
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    navigate("/home");
  }

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Outlet />
      </div>
    </>
  );
}
