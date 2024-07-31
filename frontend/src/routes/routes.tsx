import { createBrowserRouter } from "react-router-dom";

import publicRoutes from "./publicRoutes";
import authenticatedRoutes from "./authenticatedRoutes";

export const router = createBrowserRouter([
  ...authenticatedRoutes,
  ...publicRoutes,
]);
