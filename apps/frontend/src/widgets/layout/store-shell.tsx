import { ReactNode } from "react";

import { SiteFooter } from "@/widgets/footer/site-footer";
import { SiteHeader } from "@/widgets/header/site-header";

type StoreShellProps = {
  children: ReactNode;
};

export function StoreShell({ children }: StoreShellProps) {
  return (
    <>
      <SiteHeader />
      <main style={{ flex: 1, padding: "32px 0" }}>{children}</main>
      <SiteFooter />
    </>
  );
}
