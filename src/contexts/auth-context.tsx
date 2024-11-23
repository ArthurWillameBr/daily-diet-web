import { createContext, ReactNode, useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Authenticate, AuthenticateRequest } from "@/api/authenticate";
import { api } from "@/lib/axios";

interface AuthContextProps {
  signIn: (user: AuthenticateRequest) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
  isPending: boolean;
  isTokenLoading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTokenFromStorage = () => {
      const storageToken = localStorage.getItem("@Auth:token");

      if (storageToken) {
        setToken(storageToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${storageToken}`;
      } else {
        setToken(null);
      }
      setIsLoading(false);
    };

    loadTokenFromStorage();
  }, []);

  const { mutateAsync: authenticate, isPending } = useMutation({
    mutationFn: Authenticate,
  });

  const signIn = async ({ email, password }: AuthenticateRequest) => {
    try {
      const data = await authenticate({ email, password });
      const token = data.token;
      setToken(token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("@Auth:token", token);
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  };

  const signOut = () => {
    setToken(null);
    localStorage.removeItem("@Auth:token");
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        isAuthenticated: !!token,
        isPending,
        isTokenLoading: isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
