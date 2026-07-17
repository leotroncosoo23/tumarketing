"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

export type Moneda = "ARS" | "USD";

type CurrencyContextType = {
  moneda: Moneda;
  setMoneda: (moneda: Moneda) => void;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const MONEDA_STORAGE_KEY = "tumarketing_moneda";

// Estado global de moneda (ARS/USD). Lo consultan el carrito y cualquier
// listado de precios que quiera mostrar el mismo valor en toda la app.
export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [moneda, setMonedaState] = useState<Moneda>("ARS");

  // localStorage no existe en el servidor y su valor puede no coincidir con
  // el HTML ya renderizado, así que esta lectura tiene que esperar a después
  // del hidratado (deliberadamente en un efecto).
  useEffect(() => {
    const guardada = window.localStorage.getItem(MONEDA_STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (guardada === "ARS" || guardada === "USD") setMonedaState(guardada);
  }, []);

  const setMoneda = (nuevaMoneda: Moneda) => {
    setMonedaState(nuevaMoneda);
    window.localStorage.setItem(MONEDA_STORAGE_KEY, nuevaMoneda);
  };

  return <CurrencyContext.Provider value={{ moneda, setMoneda }}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const contexto = useContext(CurrencyContext);
  if (!contexto) throw new Error("useCurrency debe usarse dentro de un CurrencyProvider");
  return contexto;
}
