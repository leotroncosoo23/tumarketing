"use client";

import { useState } from "react";
import { useCart } from "@/lib/CartContext";
import { useCurrency } from "@/lib/CurrencyContext";
import { crearPreferenciaPago } from "@/app/actions/mercadopago";
import { crearOrdenPayPalAction } from "@/app/actions/paypal";

export default function CartDrawer() {
  const { items, isOpen, cerrarCarrito, eliminarItem, calcularTotal } = useCart();
  const { moneda, setMoneda } = useCurrency();
  const [procesandoPago, setProcesandoPago] = useState(false);
  const [errorPago, setErrorPago] = useState<string | null>(null);

  const total = calcularTotal(moneda);
  const simbolo = moneda === "ARS" ? "$" : "U$D ";
  const formatoLocale = moneda === "ARS" ? "es-AR" : "en-US";

  const handleCheckoutMercadoPago = async () => {
    setErrorPago(null);
    setProcesandoPago(true);
    try {
      const resultado = await crearPreferenciaPago(items);
      if (!resultado.ok) {
        setErrorPago(resultado.error);
        setProcesandoPago(false);
        return;
      }
      window.location.href = resultado.initPoint;
    } catch {
      setErrorPago("No pudimos conectar con Mercado Pago. Intentá de nuevo.");
      setProcesandoPago(false);
    }
  };

  // Si el usuario está viendo precios en USD, el pago se procesa siempre con
  // PayPal: no tiene sentido ofrecerle Mercado Pago (solo cobra en ARS).
  const handleCheckoutPayPal = async () => {
    setErrorPago(null);
    setProcesandoPago(true);
    try {
      const resultado = await crearOrdenPayPalAction(items);
      if (!resultado.ok) {
        setErrorPago(resultado.error);
        setProcesandoPago(false);
        return;
      }
      window.location.href = resultado.linkAprobacion;
    } catch {
      setErrorPago("No pudimos conectar con PayPal. Intentá de nuevo.");
      setProcesandoPago(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={cerrarCarrito}
        aria-hidden="true"
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Panel lateral */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        className={`fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-neutral-950 border-l border-neutral-800 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800 shrink-0">
          <h2 className="text-lg font-bold text-white">Tu Carrito</h2>
          <button
            onClick={cerrarCarrito}
            aria-label="Cerrar carrito"
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cuerpo */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-3">
              <svg className="w-12 h-12 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M3 3h2l.4 2M7 13h10l3.6-8H5.4M7 13L5.4 5M7 13l-2.3 4.6A1 1 0 0 0 5.6 19H17M17 19a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM9 21a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"
                />
              </svg>
              <p className="text-neutral-400 text-sm">Tu carrito está vacío.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-4 bg-neutral-900/50 border border-neutral-800 rounded-2xl p-3"
                >
                  <img
                    src={item.miniatura_url}
                    alt={item.titulo}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 bg-neutral-800"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wide text-[#ccff00]/80 mb-0.5">
                      {item.tipo === "curso" ? "Curso" : "Servicio"}
                    </span>
                    <p className="text-sm font-semibold text-white truncate">{item.titulo}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {simbolo}
                      {Number(moneda === "ARS" ? item.precio_ars : item.precio_usd).toLocaleString(formatoLocale)}
                    </p>
                  </div>
                  <button
                    onClick={() => eliminarItem(item.id)}
                    aria-label={`Eliminar ${item.titulo} del carrito`}
                    className="p-2 rounded-lg text-red-500/70 hover:text-red-500 hover:bg-red-500/10 transition-colors shrink-0"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 7h12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-1 13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 7h14Z"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pie */}
        <div className="border-t border-neutral-800 px-6 py-5 space-y-4 shrink-0">
          {/* Selector de moneda: define en el momento con qué pasarela se va a pagar
              (ARS -> Mercado Pago, USD -> PayPal), para que quede explícito acá mismo
              y no dependa de lo que haya quedado elegido en otra página. */}
          <div className="flex items-center justify-between">
            <span className="text-neutral-400 text-sm font-medium">Pagar en</span>
            <div className="flex bg-neutral-900 p-1 rounded-lg border border-neutral-800">
              <button
                onClick={() => setMoneda("ARS")}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                  moneda === "ARS" ? "bg-[#ccff00] text-black" : "text-neutral-400 hover:text-white"
                }`}
              >
                ARS (Mercado Pago)
              </button>
              <button
                onClick={() => setMoneda("USD")}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                  moneda === "USD" ? "bg-[#ffc439] text-black" : "text-neutral-400 hover:text-white"
                }`}
              >
                USD (PayPal)
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-neutral-400 text-sm font-medium">Total</span>
            <span className="text-2xl font-black text-white">
              {simbolo}
              {total.toLocaleString(formatoLocale)}
              <span className="text-xs font-normal text-neutral-500 ml-1">{moneda}</span>
            </span>
          </div>
          {moneda === "USD" ? (
            <>
              <button
                onClick={handleCheckoutPayPal}
                disabled={items.length === 0 || procesandoPago}
                className="w-full bg-[#ffc439] text-black text-base font-black py-4 rounded-xl hover:bg-[#f0b429] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#ffc439]"
              >
                {procesandoPago ? "Redirigiendo a PayPal..." : "Pagar con PayPal"}
              </button>
              {errorPago && <p className="text-red-400 text-xs text-center">{errorPago}</p>}
            </>
          ) : (
            <>
              <button
                onClick={handleCheckoutMercadoPago}
                disabled={items.length === 0 || procesandoPago}
                className="w-full bg-[#ccff00] text-black text-base font-black py-4 rounded-xl hover:bg-[#b8e600] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#ccff00]"
              >
                {procesandoPago ? "Redirigiendo a Mercado Pago..." : "Proceder al Pago"}
              </button>
              {errorPago && <p className="text-red-400 text-xs text-center">{errorPago}</p>}
            </>
          )}
        </div>
      </div>
    </>
  );
}
