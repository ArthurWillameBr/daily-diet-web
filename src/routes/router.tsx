import { createBrowserRouter, Navigate } from "react-router-dom";
import { SignIn } from "../pages/auth/sign-in";
import { Home } from "../pages/home";

export const router = createBrowserRouter([
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "*",
    element: <Navigate to="/home" />,
  },
]);
