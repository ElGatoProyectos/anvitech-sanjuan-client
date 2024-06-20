import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "./context/session.auth.provider";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Anvitech",
  description: "Control de horarios Anvitech",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <NextAuthProvider>
        <body className={inter.className}>
          <Providers>{children}</Providers>
        </body>
      </NextAuthProvider>
    </html>
  );
}
