"use client";
import { useContext, useEffect, useState } from "react";
import TabNavigation from "../tab-navigation";
import { Auth } from "@/hooks/auth";
import { api } from "@/services/apiClient";
import { useToast } from "@/components/ui/use-toast";
import { TabControlContext } from "@/hooks/tab-control";
import Home from "./home";

export default function ScreenNavigation() {
  const { state } = useContext(TabControlContext);

  const { toast } = useToast();

  return (
    <TabNavigation>
      {state.currentTab === 1 && <Home />}
      {/* {state.currentTab === 2 && <UserData />}
      {state.currentTab === 3 && (
        <Requests data={serviceRequests} isLoading={isLoading} />
      )} */}
    </TabNavigation>
  );
}
