
import { toast } from "@/components/ui/use-toast";

// In a real app, this would be connected to a backend service
const DEMO_USER = {
  email: "demo@example.com",
  password: "password123",
};

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthUser {
  email: string;
  name: string;
  avatar: string;
}

// Simulate login with a delay for realism
export const login = async (credentials: LoginCredentials): Promise<AuthUser | null> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const { email, password } = credentials;
      
      if (email === DEMO_USER.email && password === DEMO_USER.password) {
        // Successful login
        const user = {
          email: DEMO_USER.email,
          name: "Demo User",
          avatar: `https://ui-avatars.com/api/?name=Demo+User&background=0ea5e9&color=fff&size=128`,
        };
        
        // Store user in localStorage
        localStorage.setItem("user", JSON.stringify(user));
        resolve(user);
      } else {
        // Failed login
        resolve(null);
      }
    }, 800); // Delay for realism
  });
};

export const logout = (): void => {
  localStorage.removeItem("user");
  toast({
    title: "Logged out",
    description: "You have been successfully logged out",
  });
};

export const getUser = (): AuthUser | null => {
  const user = localStorage.getItem("user");
  if (user) {
    return JSON.parse(user);
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return getUser() !== null;
};
