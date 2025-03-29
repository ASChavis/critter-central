import { createContext, useState, useContext, ReactNode } from "react";
import { useRouter } from "expo-router";
import { login as mockLogin } from "../lib/authService";
import { AuthContextType, User } from "../types/auth";
import mockData from "../data/mockData";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();

  const initialUser: User = {
    ...mockData.users[0],
    households: mockData.users[0].households || [],
  };

  const [user, setUser] = useState<User | null>(initialUser);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const authenticatedUser = await mockLogin(email, password);
      setUser(authenticatedUser);
      router.replace("/homepage/[id]");
      return authenticatedUser;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
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

export default AuthProvider;
