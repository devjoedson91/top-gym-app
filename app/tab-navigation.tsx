import { ReactNode, useContext } from "react";
import { TabControlContext } from "@/hooks/tab-control";
import {
  ClockCounterClockwise,
  House,
  UserCircle,
} from "@phosphor-icons/react";
interface TabNavigationProps {
  children: ReactNode;
}

export default function TabNavigation({ children }: TabNavigationProps) {
  const { dispatch, state } = useContext(TabControlContext);

  return (
    <>
      <div className="mb-24">{children}</div>
      <footer className="fixed -bottom-1 text-gray200 flex h-20 w-full items-center justify-around bg-gray600">
        <div
          className={`${
            state.currentTab === 1 && "text-green700"
          } flex flex-1 flex-col items-center gap-2`}
          onClick={() => dispatch({ type: "home" })}
        >
          <House size={32} />
        </div>
        <div
          className={`${
            state.currentTab === 2 && "text-green700"
          } flex flex-1 flex-col items-center gap-2`}
          onClick={() => dispatch({ type: "training" })}
        >
          <ClockCounterClockwise size={32} />
        </div>
        <div
          className={`${
            state.currentTab === 3 && "text-green700"
          } flex flex-1 flex-col items-center gap-2`}
          onClick={() => dispatch({ type: "perfil" })}
        >
          <UserCircle size={32} />
        </div>
      </footer>
    </>
  );
}
