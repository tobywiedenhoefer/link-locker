import { RouteObject } from "react-router-dom";
import Login from "../pages/Login/Login";
import UnprotectedRoute from "./UnprotectedRoutes";
import App from "../App";
import CreateAnAccount from "../pages/CreateAnAccount/CreateAnAccount";

const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: (
      <UnprotectedRoute>
        <App />
      </UnprotectedRoute>
    ),
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/create-an-account",
        element: <CreateAnAccount />,
      },
    ],
  },
];

export default publicRoutes;
