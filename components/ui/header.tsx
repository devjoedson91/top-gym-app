import { ReactNode } from "react";

type HeaderProps = {
  children: ReactNode;
};

export default function Header({ children }: HeaderProps) {
  return (
    <header className="bg-secondary h-24 w-full flex items-center justify-between px-5">
      {children}
    </header>
  );
}
