import { Navigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import React from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
}
