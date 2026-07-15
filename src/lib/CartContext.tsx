"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Moneda } from "@/lib/CurrencyContext";

export type TipoItemCarrito = "curso" | "servicio";

// Forma de un ítem dentro del carrito. Sirve tanto para cursos como para servicios.
export type ItemCarrito = {
  id: string;
  titulo: string;
  tipo: TipoItemCarrito;
  precio_ars: number;
  precio_usd: number;
  miniatura_url: string;
};

type CartContextType = {
  items: ItemCarrito[];
  cantidadItems: number;
  isOpen: boolean;
  agregarItem: (item: ItemCarrito) => void;
  eliminarItem: (id: string) => void;
  vaciarCarrito: () => void;
  abrirCarrito: () => void;
  cerrarCarrito: () => void;
  toggleCarrito: () => void;
  calcularTotal: (moneda: Moneda) => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CARRITO_STORAGE_KEY = "tumarketing_carrito";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hidratado, setHidratado] = useState(false);

  // Recupera el carrito guardado en el navegador al montar.
  useEffect(() => {
    try {
      const guardado = window.localStorage.getItem(CARRITO_STORAGE_KEY);
      if (guardado) setItems(JSON.parse(guardado));
    } catch {
      // localStorage corrupto o no disponible: arrancamos con el carrito vacío.
    }
    setHidratado(true);
  }, []);

  // Persiste cada cambio, evitando pisar lo guardado antes de hidratar.
  useEffect(() => {
    if (!hidratado) return;
    window.localStorage.setItem(CARRITO_STORAGE_KEY, JSON.stringify(items));
  }, [items, hidratado]);

  const agregarItem = useCallback((item: ItemCarrito) => {
    setItems((actuales) => (actuales.some((i) => i.id === item.id) ? actuales : [...actuales, item]));
    setIsOpen(true);
  }, []);

  const eliminarItem = useCallback((id: string) => {
    setItems((actuales) => actuales.filter((i) => i.id !== id));
  }, []);

  const vaciarCarrito = useCallback(() => setItems([]), []);
  const abrirCarrito = useCallback(() => setIsOpen(true), []);
  const cerrarCarrito = useCallback(() => setIsOpen(false), []);
  const toggleCarrito = useCallback(() => setIsOpen((valor) => !valor), []);

  const calcularTotal = useCallback(
    (moneda: Moneda) => items.reduce((total, item) => total + (moneda === "ARS" ? item.precio_ars : item.precio_usd), 0),
    [items]
  );

  const value = useMemo<CartContextType>(
    () => ({
      items,
      cantidadItems: items.length,
      isOpen,
      agregarItem,
      eliminarItem,
      vaciarCarrito,
      abrirCarrito,
      cerrarCarrito,
      toggleCarrito,
      calcularTotal,
    }),
    [items, isOpen, agregarItem, eliminarItem, vaciarCarrito, abrirCarrito, cerrarCarrito, toggleCarrito, calcularTotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const contexto = useContext(CartContext);
  if (!contexto) throw new Error("useCart debe usarse dentro de un CartProvider");
  return contexto;
}
