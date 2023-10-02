import { createBrowserRouter } from "react-router-dom";
import App from "./app";
import { IndexPage } from "./index/index-page";
import { LoginPage } from "./login/login-page";
import { DashboardPage } from "./dashboard/dashboard-page";
import { ErrorPage } from "./error/error-page";
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
