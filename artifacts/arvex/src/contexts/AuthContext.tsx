import React, { createContext, useContext, useEffect, useState } from "react";
import { useGetMe, User, getGetMeQueryKey } from "@workspace/api-client-react";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("arvex_token"));

  const { data: user, isLoading: isMeLoading, refetch } = useGetMe({
    query: {
      enabled: !!token,
      retry: false,
      queryKey: getGetMeQueryKey(),
    }
  });

  const login = (newToken: string) => {
    localStorage.setItem("arvex_token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("arvex_token");
    setToken(null);
  };

  useEffect(() => {
    if (token) {
      refetch();
    }
  }, [token, refetch]);

  return (
    <AuthContext.Provider value={{ user: user || null, isLoading: isMeLoading, login, logout, token }}>
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
