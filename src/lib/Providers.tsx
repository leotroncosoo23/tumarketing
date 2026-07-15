"use client";

import type { ReactNode } from "react";
import { CurrencyProvider } from "@/lib/CurrencyContext";
import { CartProvider } from "@/lib/CartContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <CurrencyProvider>
      <CartProvider>{children}</CartProvider>
    </CurrencyProvider>
  );
}
