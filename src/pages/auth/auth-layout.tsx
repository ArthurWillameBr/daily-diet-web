import { Header } from "@/components/header";
import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Outlet />
      </div>
    </>
  );
}
