import { createContext, useState, useContext, ReactNode } from "react";
import { useRouter } from "expo-router";
import { login as mockLogin } from "../lib/authService";
import { AuthContextType, User } from "../types/auth";
import mockData from "../data/mockData";

// ✅ Create AuthContext with proper type safety
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();

  // ✅ Ensure the user has a default structure
  const initialUser: User = {
    ...mockData.users[0],
    households: mockData.users[0].households || [], // ✅ Avoids undefined issues
  };

  const [user, setUser] = useState<User | null>(initialUser);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const authenticatedUser = await mockLogin(email, password);
      setUser(authenticatedUser);
      router.replace("/");
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

// ✅ Provide useAuth Hook for easy access
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// ✅ Default export to satisfy Expo Router requirements
export default AuthProvider;
