import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AuthContextType from "../types/AuthContextType.type";

const AuthContext = createContext<AuthContextType>({
  token: null,
  updateToken: () => {},
});

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const updateToken = (newToken: string | null) => {
    setToken(newToken);
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const contextValue = useMemo(
    () => ({
      token,
      updateToken,
    }),
    [token]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
