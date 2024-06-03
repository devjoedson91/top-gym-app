"use client";
import { createContext, ReactNode, useState, useEffect } from "react";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { useRouter } from "next/navigation";
import { api } from "@/services/apiClient";
import { useToast } from "@/components/ui/use-toast";

type UserProps = {
  id: string;
  name: string;
  email: string;
  token: string;
};

type UserInfoProps = {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string | null;
};

type SignInProps = {
  email: string;
  password: string;
};

type AuthProviderProps = {
  children: ReactNode;
};

type AuthContextData = {
  user: UserProps;
  isAuthenticated: boolean;
  loadingAuth: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => void;
};

export const Auth = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const { toast } = useToast();

  const [user, setUser] = useState<UserProps>({
    id: "",
    name: "",
    email: "",
    token: "",
  });

  const [me, setMe] = useState<UserInfoProps>({
    id: "",
    name: "",
    email: "",
    password: "",
    avatar: null,
  });

  const [loadingAuth, setLoadingAuth] = useState(false);

  const isAuthenticated = !!user;

  const router = useRouter();

  useEffect(() => {
    const { "@topgym.token": token } = parseCookies();

    if (token) {
      api
        .get("/me")
        .then((response) => {
          const { id, name, email } = response.data;

          setUser({ id, name, email, token });
        })
        .catch(() => {
          signOut();
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function signOut() {
    try {
      destroyCookie(undefined, "@topgym.token");

      router.push("/");
    } catch (error: any) {
      toast({
        description: "Erro ao fazer Logout",
        variant: "destructive",
      });
    }
  }

  async function signIn({ email, password }: SignInProps) {
    try {
      setLoadingAuth(true);

      const response = await api.post("/session", {
        email,
        password,
      });

      const { id, name, token } = response.data;

      setCookie(undefined, "@topgym.token", token, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });

      setUser({ id, name, email, token });

      api.defaults.headers["Authorization"] = `Bearer ${token}`;

      router.push("/dashboard");
    } catch (err: any) {
      toast({
        title: "Não foi possível realizar o login:",
        description: err.response?.data.error,
        variant: "destructive",
      });
    } finally {
      setLoadingAuth(false);
    }
  }

  return (
    <Auth.Provider
      value={{ signIn, signOut, isAuthenticated, user, loadingAuth }}
    >
      {children}
    </Auth.Provider>
  );
}
