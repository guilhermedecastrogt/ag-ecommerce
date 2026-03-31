import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Admin — Águia Diesel",
  description: "Painel administrativo Águia Diesel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="h-full bg-neutral-light">{children}</body>
    </html>
  );
}
