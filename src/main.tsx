import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
import App from "./app/app";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { IndexPage } from "./app/index/index-page";
import { LoginPage } from "./app/login/login-page";
import { DashboardPage } from "./app/dashboard/dashboard-page";
import { ErrorPage } from "./app/error/error-page";
import { FirebaseAuthProvider } from "./app/feature/user-hook";

const router = createBrowserRouter([
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

const rootElement = document.getElementById("root");
if (rootElement !== null) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
