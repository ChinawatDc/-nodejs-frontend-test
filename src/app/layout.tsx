"use client";
import { Prompt } from "next/font/google";
import { useEffect } from "react";
import "../styles/globals.css";
import AppMenu from "./layout/menu";

const prompt = Prompt({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    document.title = "Test Dev";
  }, []);

  //
  return (
    <html lang="en">
      <body className={`${prompt.className} antialiased`}>
        <AppMenu />
        {children}
      </body>
    </html>
  );
}
