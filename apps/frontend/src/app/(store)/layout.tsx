import { ReactNode } from "react";

import { StoreShell } from "@/widgets/layout/store-shell";

type StoreLayoutProps = {
  children: ReactNode;
};

export default function StoreLayout({ children }: StoreLayoutProps) {
  return <StoreShell>{children}</StoreShell>;
}
