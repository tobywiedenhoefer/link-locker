import { useEffect } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

type LogoutProps = {};
export default function Logout(_: LogoutProps) {
  const { updateToken } = useAuth();
  useEffect(() => {
    updateToken(null);
  }, []);
  return <Navigate to="/" replace />;
}
