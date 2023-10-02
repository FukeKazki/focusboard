import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";

// ╭──────────────────────────────────────────────────────────╮
// │  エントリーファイル                                      │
// ╰──────────────────────────────────────────────────────────╯
const rootElement = document.getElementById("root");
if (rootElement !== null) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  );
}
