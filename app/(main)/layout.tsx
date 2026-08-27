import type { ReactNode } from "react";
import Header from "@/components/commons/header";

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
