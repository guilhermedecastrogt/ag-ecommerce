import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Águia Diesel — Diagnóstico e Tecnologia em Sistemas Diesel",
  description:
    "Serviços, testes e manutenção com infraestrutura de laboratório e atendimento especializado. Mais de 50 anos de experiência em sistemas diesel.",
  keywords: [
    "diesel",
    "diagnóstico diesel",
    "manutenção diesel",
    "common rail",
    "laboratório diesel",
    "Goiânia",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${barlow.variable} ${barlowCondensed.variable} h-full antialiased`}
    >
      <body className="h-full overflow-auto md:overflow-hidden">{children}</body>
    </html>
  );
}
