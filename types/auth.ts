export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  households: string[];
  token: string;
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
}

const authTypes = {};
export default authTypes;
