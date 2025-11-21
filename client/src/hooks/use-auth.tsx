import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

export type Role = "admin" | "organizer" | "approver" | "attendee";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
}

export const MOCK_USERS: User[] = [
  {
    id: "u1",
    name: "Alice Admin",
    email: "alice@university.edu",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: "u2",
    name: "Bob Organizer",
    email: "bob@university.edu",
    role: "organizer",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: "u3",
    name: "Carol Approver",
    email: "carol@university.edu",
    role: "approver",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: "u4",
    name: "Dave Student",
    email: "dave@university.edu",
    role: "attendee",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
  },
];

interface AuthContextType {
  user: User | null;
  login: (role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(MOCK_USERS[0]); // Default to Admin for demo
  const { toast } = useToast();

  const login = (role: Role) => {
    const foundUser = MOCK_USERS.find((u) => u.role === role);
    if (foundUser) {
      setUser(foundUser);
      toast({
        title: `Switched to ${foundUser.name}`,
        description: `You are now viewing as a ${role}.`,
      });
    }
  };

  const logout = () => {
    setUser(null);
    toast({
      title: "Logged out",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
