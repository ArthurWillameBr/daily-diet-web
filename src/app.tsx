import { RouterProvider } from "react-router-dom";
import { router } from "./pages/auth/routes/router";

export function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
