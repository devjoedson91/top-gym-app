"use client";
import { Dispatch, ReactNode, createContext, useReducer } from "react";

const tabs = ["home", "training", "perfil"];

interface AppControlProps {
  children: ReactNode;
}

interface StateProps {
  tabs: string[];
  tabStage: string;
  currentTab: number;
}

interface ActionProps {
  readonly type: "home" | "training" | "perfil";
  payload?: number;
}

const initialState = {
  tabs,
  tabStage: tabs[0],
  currentTab: 1,
};

interface TabControlContextData {
  state: StateProps;
  dispatch: Dispatch<ActionProps>;
}

const tabReducer = (state: StateProps, action: ActionProps) => {
  switch (action.type) {
    case "training":
      return {
        ...state,
        tabStage: tabs[1],
        currentTab: 2,
      };
    case "perfil":
      return {
        ...state,
        tabStage: tabs[2],
        currentTab: 3,
      };
    default:
      return {
        ...state,
        tabStage: tabs[0],
        currentTab: 1,
      };
  }
};

export const TabControlContext = createContext({} as TabControlContextData);

function TabControlProvider({ children }: AppControlProps) {
  const [state, dispatch] = useReducer(tabReducer, initialState);

  return (
    <TabControlContext.Provider value={{ dispatch, state }}>
      {children}
    </TabControlContext.Provider>
  );
}

export default TabControlProvider;
