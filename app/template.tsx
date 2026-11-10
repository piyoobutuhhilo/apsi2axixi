"use client";

import { ReactNode } from "react";

export default function Template({ children }: { children: ReactNode }) {
  return (
    <div className="animate-page-enter w-full min-h-screen">
      {children}
    </div>
  );
}