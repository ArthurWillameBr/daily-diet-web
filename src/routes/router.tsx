import { createBrowserRouter, Navigate } from "react-router-dom";
import { SignIn } from "../pages/auth/sign-in";
import { Home } from "../pages/home";
import { AuthLayout } from "@/pages/auth/auth-layout";
import { SignUp } from "@/pages/auth/sign-up";
import { PrivateRoutes } from "./private-routes";

export const router = createBrowserRouter([
  {
    path: "/home",
    element: <PrivateRoutes />,
    children: [{ path: "/home", element: <Home /> }],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "sign-in", element: <SignIn /> },
      { path: "sign-up", element: <SignUp /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/home" />,
  },
]);
