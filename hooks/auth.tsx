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
  me: UserInfoProps;
  isAuthenticated: boolean;
  loadingAuth: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => void;
};

export const Auth = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const { toast } = useToast();

  const router = useRouter();

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
    avatar: null,
  });

  const [loadingAuth, setLoadingAuth] = useState(false);

  const isAuthenticated = !!user;

  useEffect(() => {
    const { "@topgym.token": token } = parseCookies();

    const hasUser: UserProps = JSON.parse(token || "{}");

    if (Object.keys(hasUser).length > 0) {
      api.defaults.headers.common["Authorization"] = `Bearer ${hasUser.token}`;

      setUser({
        id: hasUser.id,
        name: hasUser.name,
        email: hasUser.email,
        token: hasUser.token,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    !!user.name && userInfo();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function userInfo() {
    try {
      const response = await api.get("/me");

      setMe(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast({
          description:
            "Falha ao carregar dados do usuário, entre novamente com seu email e senha",
          variant: "destructive",
        });
      }
    }
  }

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

      const data = { ...response.data };

      setCookie(undefined, "@topgym.token", JSON.stringify(data), {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });

      setUser({ id: data.id, name: data.name, email, token: data.token });

      api.defaults.headers["Authorization"] = `Bearer ${data.token}`;

      router.push("/screen-navigation");
    } catch (error: any) {
      switch (error.response.status) {
        case 400:
          toast({
            description:
              "Instabilidade na conexão com a base dados, contate o suporte",
            variant: "destructive",
          });
          break;
        case 500:
          toast({
            description: "Instabilidade no servidor, contate o suporte",
            variant: "destructive",
          });
          break;
        default:
          toast({
            description: "Não foi possível fazer o login, contate o suporte",
            variant: "destructive",
          });
      }
    } finally {
      setLoadingAuth(false);
    }
  }

  return (
    <Auth.Provider
      value={{ signIn, signOut, isAuthenticated, user, loadingAuth, me }}
    >
      {children}
    </Auth.Provider>
  );
}
