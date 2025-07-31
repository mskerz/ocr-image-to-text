"use client";

import { ChildrenProps } from "@/type/children";
import { useEffect, useState } from "react";

function ClientLayout({ children }: ChildrenProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return <>{children}</>;
}
export default ClientLayout;
