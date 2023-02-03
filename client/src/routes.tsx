import { Route } from "@tanstack/react-location";
import App from "./App";
import LoginPage from "./pages/LoginPage";

const routes: Route[] = [
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
];

export default routes;
