import type { ReactNode } from "react";
import { StoreProvider } from "./StoreProvider";

import "./globals.css";

interface Props {
  readonly children: ReactNode;
}
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function RootLayout({ children }: Props) {
  return (
    <StoreProvider>
      <html className={inter.variable} lang="en">
        <body className="flex h-[100dvh] w-[100dvw] flex-col items-center justify-center gap-5 bg-stone-200 p-1 px-4">
          <header className="w-full flex-shrink py-2 text-center text-2xl font-bold">
            Todo app
          </header>
          <main className="h-full w-full flex-grow">{children}</main>
        </body>
      </html>
    </StoreProvider>
  );
}
