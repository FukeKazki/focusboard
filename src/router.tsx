import { createBrowserRouter } from "react-router-dom";
import App from "./pages/app";
import { IndexPage } from "./pages/index/index-page";
import { LoginPage } from "./pages/login/login-page";
import { DashboardPage } from "./pages/dashboard/dashboard-page";
import { ErrorPage } from "./pages/error/error-page";
import { FirebaseAuthProvider } from "./feature/user-hook";

// ╭──────────────────────────────────────────────────────────╮
// │  ルーティングの定義                                      │
// ╰──────────────────────────────────────────────────────────╯
export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <FirebaseAuthProvider>
        <App />
      </FirebaseAuthProvider>
    ),
    children: [
      {
        path: "",
        element: <IndexPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "dashboard/:id",
        element: <DashboardPage />,
      },
    ],
    errorElement: <ErrorPage />,
  },
]);
