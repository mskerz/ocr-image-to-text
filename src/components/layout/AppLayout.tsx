"use client";

import { ChildrenProps } from "@/type/children";
import { ThemeProvider } from "../ui/theme-provider";
import ReduxProvider from "./ReduxProvider";
import { Toaster } from "../ui/sonner";
import React from "react";
const Navbar = React.lazy(() => import("./Navbar"));
function AppLayout({ children }: ChildrenProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ReduxProvider>
        <Toaster />
        <main className="bg-main-gradient to-muted text-foreground flex min-h-screen w-full">
          <div className="flex-1">
            <Navbar />
            {children}
          </div>
        </main>
      </ReduxProvider>
    </ThemeProvider>
  );
}
export default AppLayout;
