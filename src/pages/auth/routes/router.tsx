import { createBrowserRouter, Navigate } from "react-router-dom";
import { SignIn } from "../sign-in";
import { Home } from "../home";

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
