import { User } from "../types/auth";

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Test1",
    email: "test@example.com",
    households: [],
    token: "token123",
  },
  {
    id: "2",
    name: "Test2",
    email: "admin@example.com",
    households: [],
    token: "admintoken456",
  },
];

export const login = async (email: string, password: string): Promise<User> => {
  return new Promise<User>((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find((u) => u.email === email);
      if (user) {
        resolve(user);
      } else {
        reject(new Error("Invalid credentials"));
      }
    }, 1000);
  });
};

// ✅ Add default export for Expo Router compatibility
export default { mockUsers, login };
