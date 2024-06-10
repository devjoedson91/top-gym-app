"use client";
import { useContext, useEffect, useState } from "react";
import TabNavigation from "../tab-navigation";
import { api } from "@/services/apiClient";
import { useToast } from "@/components/ui/use-toast";
import { TabControlContext } from "@/hooks/tab-control";
import Home from "./home";
import { useQuery } from "react-query";
import { CategoriesProps } from "@/types";
import Loading from "@/components/ui/loading";
import Training from "./training";
import Profile from "./profile";

export default function ScreenNavigation() {
  const { state } = useContext(TabControlContext);

  const { toast } = useToast();

  const [categories, setCategories] = useState<CategoriesProps[]>([]);

  const { data, isLoading } = useQuery(
    "categories",
    () => {
      return api
        .get("/categories")
        .then((response) => {
          return response.data;
        })
        .catch((error: any) => {
          if (error.response?.status === 401) {
            toast({
              description:
                "Ação não autorizada, entre novamente com seu email e senha",
              variant: "destructive",
            });
          }
        });
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    !!data && setCategories(data);
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <TabNavigation>
      {state.currentTab === 1 && <Home categories={categories} />}
      {state.currentTab === 2 && <Training />}
      {state.currentTab === 3 && <Profile />}
    </TabNavigation>
  );
}
