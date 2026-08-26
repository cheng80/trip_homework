import type { ReactNode } from "react";
import Header from "@/components/commons/header";
import { mypageMember } from "@/data/mypage";

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <Header user={mypageMember} />
      {children}
    </>
  );
}
