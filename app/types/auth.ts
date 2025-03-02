export interface User {
  id: string;
  email: string;
  token: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>; // ✅ Change return type from void → User
  logout: () => void;
}
