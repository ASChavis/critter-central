import { createContext, useState, useContext, ReactNode } from "react";
import { login as mockLogin } from "../lib/authService";
import { AuthContextType, User } from "../types/auth";

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const authenticatedUser = await mockLogin(email, password);
      setUser(authenticatedUser);
      return authenticatedUser; // ✅ Return User instead of void
    } catch (error) {
      throw error;
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};


