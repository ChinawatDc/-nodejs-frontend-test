"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import AppMenu from "./layout/menu";

const ignorePaths = ["/auth", "/login", "/bypass"];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    document.title = "Test Dev";
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken && pathname !== "/login") {
      router.push("/login");
    }
  }, [pathname, router]);

  return (
    <html lang="en">
      <body className="antialiased">
        {!ignorePaths.includes(pathname) && <AppMenu />}
        {children}
      </body>
    </html>
  );
}
