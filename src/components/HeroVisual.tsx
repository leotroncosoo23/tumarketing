"use client";

import { motion } from "framer-motion";
import { TrendingUp, Eye, Flame } from "lucide-react";

// Alturas simuladas de una tendencia de crecimiento ascendente.
const barrasCrecimiento = [30, 45, 38, 58, 50, 72, 90, 100];

export default function HeroVisual() {
  return (
    <div className="relative w-full">
      {/* Brillos de fondo para efecto 3D, con movimiento sutil */}
      <div className="absolute top-10 -right-10 w-64 h-64 bg-[#ccff00]/20 blur-[80px] rounded-full z-0 animate-float-slow"></div>
      <div className="absolute -bottom-10 left-10 w-48 h-48 bg-lime-600/20 blur-[60px] rounded-full z-0 animate-float-slow" style={{ animationDelay: "-3s" }}></div>

      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="relative z-10"
      >
        {/* Notificación flotante: confianza */}
        <div className="absolute -top-6 -left-6 z-20 bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-400" fill="currentColor" />
          <span className="text-white text-xs font-bold">+150 marcas confían en nosotros</span>
        </div>

        {/* Notificación flotante: alcance */}
        <div className="absolute -bottom-6 -right-4 z-20 bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3">
          <span className="bg-[#D4EE26]/10 border border-[#D4EE26]/30 text-[#D4EE26] p-2 rounded-full">
            <Eye className="w-4 h-4" />
          </span>
          <div>
            <p className="text-white text-sm font-black leading-none mb-1">+4M</p>
            <p className="text-neutral-400 text-[11px] leading-none">Views generadas</p>
          </div>
        </div>

        {/* Panel principal: métricas de crecimiento */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-neutral-400 text-sm font-medium mb-1">Crecimiento mensual</p>
              <p className="text-white text-3xl font-black tracking-tight">+247%</p>
            </div>
            <span className="flex items-center gap-1.5 bg-[#D4EE26]/10 text-[#D4EE26] text-xs font-bold px-3 py-1.5 rounded-full border border-[#D4EE26]/30">
              <TrendingUp className="w-3.5 h-3.5" />
              Resultados
            </span>
          </div>

          {/* Gráfico de barras ascendente simulado */}
          <div className="flex items-end gap-2.5 h-40">
            {barrasCrecimiento.map((altura, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-md bg-gradient-to-t from-[#D4EE26]/20 to-[#D4EE26] shadow-[0_0_16px_rgba(212,238,38,0.35)]"
                style={{ height: `${altura}%` }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
