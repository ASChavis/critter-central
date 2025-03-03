export interface User {
  id: string;
  name: string;
  email: string;
  households: string[];
  token: string; // ✅ Ensure token exists in the User type
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
}
