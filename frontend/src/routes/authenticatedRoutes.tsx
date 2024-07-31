import { RouteObject } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import Locker from "../pages/Locker/Locker";
import Lockers from "../pages/Lockers/Lockers";
import App from "../App";
import Logout from "../pages/Logout/Logout";

const authenticatedRoutes: RouteObject[] = [
  {
    path: "/lockers",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/lockers",
        element: <Lockers />,
      },
      {
        path: "/lockers/locker/:locker",
        element: <Locker />,
      },
    ],
  },
  {
    path: "/logout",
    element: (
      <ProtectedRoute>
        <Logout />
      </ProtectedRoute>
    ),
  },
];

export default authenticatedRoutes;
