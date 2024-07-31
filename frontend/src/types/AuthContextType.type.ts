type AuthContextType = {
  token: string | null;
  updateToken: (newToken: string | null) => void;
};

export default AuthContextType;
