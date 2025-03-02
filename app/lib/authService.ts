import { User } from "../types/auth";

export const mockUsers: User[] = [
  { email: "test@example.com", token: "token123" },
  { email: "admin@example.com", token: "admintoken456" },
];

export const login = async (email: string, password: string): Promise<User> => {
  return new Promise<User>((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find(u => u.email === email);
      if (user) {
        resolve(user);
      } else {
        reject(new Error("Invalid credentials"));
      }
    }, 1000);
  });
};

  