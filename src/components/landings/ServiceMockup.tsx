"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Search,
  Zap,
  ShoppingCart,
  CheckCircle2,
  LayoutDashboard,
  Workflow,
  CalendarCheck,
  MessageCircle,
  Target as TargetIcon,
  TrendingUp,
  Play,
  Film,
  Code2,
  FileCode2,
  Tag,
  Plus,
  Boxes,
  PackageCheck,
  AlertTriangle,
} from "lucide-react";
import { ACCENTS, type Acento } from "./accents";

export type MockupVariant =
  | "browser"
  | "cart"
  | "dashboard"
  | "feed"
  | "target"
  | "reel"
  | "code"
  | "catalogo"
  | "stock";

type ServiceMockupProps = {
  variant: MockupVariant;
  acento: Acento;
};

// Ilustraciones decorativas abstractas (no son capturas reales de ningún
// proyecto): solo comunican de qué trata el servicio, con badges cualitativos
// en vez de métricas inventadas.
export default function ServiceMockup({ variant, acento }: ServiceMockupProps) {
  const colores = ACCENTS[acento];

  return (
    <div className="relative w-full">
      <div className={`absolute top-10 -right-10 w-64 h-64 ${colores.glow} blur-[80px] rounded-full z-0`} />
      <div className={`absolute -bottom-10 left-10 w-48 h-48 ${colores.glow} blur-[60px] rounded-full z-0`} />

      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="relative z-10"
      >
        {variant === "browser" && <MockupBrowser acento={acento} />}
        {variant === "cart" && <MockupCart acento={acento} />}
        {variant === "dashboard" && <MockupDashboard acento={acento} />}
        {variant === "feed" && <MockupFeed acento={acento} />}
        {variant === "target" && <MockupTarget acento={acento} />}
        {variant === "reel" && <MockupReel acento={acento} />}
        {variant === "code" && <MockupCode acento={acento} />}
        {variant === "catalogo" && <MockupCatalogo acento={acento} />}
        {variant === "stock" && <MockupStock acento={acento} />}
      </motion.div>
    </div>
  );
}

function Badge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`absolute z-20 bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 ${className}`}
    >
      {children}
    </div>
  );
}

function MockupBrowser({ acento }: { acento: Acento }) {
  const c = ACCENTS[acento];
  return (
    <div className="relative">
      <Badge className="-top-5 -left-5">
        <Zap className={`w-4 h-4 ${c.text}`} />
        <span className="text-white text-xs font-bold">Carga instantánea</span>
      </Badge>
      <Badge className="-bottom-5 -right-4">
        <Search className={`w-4 h-4 ${c.text}`} />
        <span className="text-white text-xs font-bold">SEO listo</span>
      </Badge>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/[0.03]">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
          <div className="ml-3 flex-1 h-5 rounded-full bg-white/5 border border-white/10" />
        </div>
        <div className="p-6 space-y-4">
          <div className={`h-24 rounded-xl bg-gradient-to-br ${c.gradientFrom}/20 to-transparent border ${c.borderSoft}`} />
          <div className="h-3 w-3/4 rounded-full bg-white/10" />
          <div className="h-3 w-1/2 rounded-full bg-white/10" />
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="h-14 rounded-lg bg-white/5 border border-white/10" />
            <div className="h-14 rounded-lg bg-white/5 border border-white/10" />
            <div className="h-14 rounded-lg bg-white/5 border border-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MockupCart({ acento }: { acento: Acento }) {
  const c = ACCENTS[acento];
  return (
    <div className="relative">
      <Badge className="-top-5 -right-5">
        <CheckCircle2 className={`w-4 h-4 ${c.text}`} />
        <span className="text-white text-xs font-bold">Pago aprobado</span>
      </Badge>
      <Badge className="-bottom-5 -left-4">
        <ShoppingCart className={`w-4 h-4 ${c.text}`} />
        <span className="text-white text-xs font-bold">Stock sincronizado</span>
      </Badge>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className={`aspect-square rounded-xl bg-gradient-to-br ${c.gradientFrom}/25 to-transparent border ${c.borderSoft}`} />
          <div className="space-y-3">
            <div className="h-3 w-full rounded-full bg-white/10" />
            <div className="h-3 w-2/3 rounded-full bg-white/10" />
            <div className={`h-8 w-20 rounded-lg ${c.bg} border ${c.borderSoft}`} />
          </div>
        </div>
        <div className={`flex items-center justify-between rounded-xl px-4 py-3 ${c.bg} border ${c.borderSoft}`}>
          <span className="text-white text-sm font-bold">Finalizar compra</span>
          <ShoppingCart className={`w-5 h-5 ${c.text}`} />
        </div>
      </div>
    </div>
  );
}

function MockupDashboard({ acento }: { acento: Acento }) {
  const c = ACCENTS[acento];
  const barras = [40, 65, 50, 80, 60, 95];
  return (
    <div className="relative">
      <Badge className="-top-5 -left-5">
        <Workflow className={`w-4 h-4 ${c.text}`} />
        <span className="text-white text-xs font-bold">Automatizado 24/7</span>
      </Badge>
      <Badge className="-bottom-5 -right-4">
        <LayoutDashboard className={`w-4 h-4 ${c.text}`} />
        <span className="text-white text-xs font-bold">Panel en tiempo real</span>
      </Badge>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <div className="h-3 w-28 rounded-full bg-white/10" />
            <div className="h-2 w-20 rounded-full bg-white/5" />
          </div>
          <span className={`p-2 rounded-full ${c.bg} border ${c.borderSoft}`}>
            <LayoutDashboard className={`w-4 h-4 ${c.text}`} />
          </span>
        </div>
        <div className="flex items-end gap-2.5 h-32">
          {barras.map((altura, i) => (
            <div
              key={i}
              className={`flex-1 rounded-t-md bg-gradient-to-t ${c.gradientFrom}/20 to-current ${c.text}`}
              style={{ height: `${altura}%`, opacity: 0.85 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MockupFeed({ acento }: { acento: Acento }) {
  const c = ACCENTS[acento];
  return (
    <div className="relative">
      <Badge className="-top-5 -left-5">
        <CalendarCheck className={`w-4 h-4 ${c.text}`} />
        <span className="text-white text-xs font-bold">Calendario listo</span>
      </Badge>
      <Badge className="-bottom-5 -right-4">
        <MessageCircle className={`w-4 h-4 ${c.text}`} />
        <span className="text-white text-xs font-bold">Comunidad atendida</span>
      </Badge>

      <div className="mx-auto max-w-[280px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-3 shadow-2xl">
        <div className="relative aspect-[9/16] rounded-[1.5rem] overflow-hidden bg-black/40">
          <Image src="/hero-community.png" alt="Publicación de Instagram gestionada por el equipo" fill sizes="280px" className="object-cover" />
        </div>
      </div>
    </div>
  );
}

function MockupTarget({ acento }: { acento: Acento }) {
  const c = ACCENTS[acento];
  return (
    <div className="relative">
      <Badge className="-top-5 -right-5">
        <TargetIcon className={`w-4 h-4 ${c.text}`} />
        <span className="text-white text-xs font-bold">Segmentado</span>
      </Badge>
      <Badge className="-bottom-5 -left-4">
        <TrendingUp className={`w-4 h-4 ${c.text}`} />
        <span className="text-white text-xs font-bold">Optimizando en vivo</span>
      </Badge>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl flex items-center justify-center">
        <div className="relative w-56 h-56 flex items-center justify-center">
          <div className={`absolute inset-0 rounded-full border ${c.borderSoft}`} />
          <div className={`absolute inset-6 rounded-full border ${c.border}`} />
          <div className={`absolute inset-12 rounded-full border-2 ${c.border}`} />
          <span className={`w-6 h-6 rounded-full ${c.badgeBg}`} />
        </div>
      </div>
    </div>
  );
}

function MockupReel({ acento }: { acento: Acento }) {
  const c = ACCENTS[acento];
  return (
    <div className="relative">
      <Badge className="-top-5 -left-5">
        <Film className={`w-4 h-4 ${c.text}`} />
        <span className="text-white text-xs font-bold">Edición profesional</span>
      </Badge>
      <Badge className="-bottom-5 -right-4">
        <Play className={`w-4 h-4 ${c.text}`} fill="currentColor" />
        <span className="text-white text-xs font-bold">Listo para publicar</span>
      </Badge>

      <div className="mx-auto max-w-[240px] aspect-[9/16] bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl relative overflow-hidden">
        <Image src="/hero-edicion.jpg" alt="Reel editado profesionalmente para redes sociales" fill sizes="240px" className="object-cover" />
      </div>
    </div>
  );
}

const LINEAS_CODIGO = [
  { indent: 0, tokens: [{ t: "export default function ", c: "text-neutral-400" }, { t: "PaginaCliente", c: "text-yellow-300" }, { t: "() {", c: "text-neutral-400" }] },
  { indent: 1, tokens: [{ t: "return ", c: "text-purple-400" }, { t: "(", c: "text-neutral-400" }] },
  { indent: 2, tokens: [{ t: "<Hero ", c: "text-sky-400" }, { t: "titulo", c: "text-cyan-300" }, { t: "=", c: "text-neutral-400" }, { t: '"Bienvenido"', c: "text-emerald-400" }, { t: " />", c: "text-sky-400" }] },
  { indent: 2, tokens: [{ t: "<Servicios ", c: "text-sky-400" }, { t: "items", c: "text-cyan-300" }, { t: "={data}", c: "text-neutral-400" }, { t: " />", c: "text-sky-400" }] },
  { indent: 1, tokens: [{ t: ")", c: "text-neutral-400" }] },
  { indent: 0, tokens: [{ t: "}", c: "text-neutral-400" }] },
];

function MockupCode({ acento }: { acento: Acento }) {
  const c = ACCENTS[acento];
  return (
    <div className="relative">
      <Badge className="-top-5 -left-5">
        <Code2 className={`w-4 h-4 ${c.text}`} />
        <span className="text-white text-xs font-bold">Código a medida</span>
      </Badge>
      <Badge className="-bottom-5 -right-4">
        <FileCode2 className={`w-4 h-4 ${c.text}`} />
        <span className="text-white text-xs font-bold">Sin templates genéricos</span>
      </Badge>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden font-mono text-xs md:text-sm">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/[0.03]">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
          <span className={`ml-3 flex items-center gap-1.5 text-neutral-400 text-xs ${c.bg} px-2.5 py-1 rounded-md border ${c.borderSoft}`}>
            <FileCode2 className="w-3 h-3" />
            pagina-cliente.tsx
          </span>
        </div>
        <div className="p-5 leading-relaxed">
          {LINEAS_CODIGO.map((linea, i) => (
            <div key={i} style={{ paddingLeft: `${linea.indent * 1.25}rem` }}>
              {linea.tokens.map((tok, j) => (
                <span key={j} className={tok.c}>
                  {tok.t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MockupCatalogo({ acento }: { acento: Acento }) {
  const c = ACCENTS[acento];
  return (
    <div className="relative">
      <Badge className="-top-5 -left-5">
        <Tag className={`w-4 h-4 ${c.text}`} />
        <span className="text-white text-xs font-bold">Catálogo actualizado</span>
      </Badge>
      <Badge className="-bottom-5 -right-4">
        <ShoppingCart className={`w-4 h-4 ${c.text}`} />
        <span className="text-white text-xs font-bold">3 en el carrito</span>
      </Badge>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
              <div className={`aspect-square bg-gradient-to-br ${c.gradientFrom}/25 to-transparent`} />
              <div className="p-2.5 space-y-2">
                <div className="h-2 w-full rounded-full bg-white/10" />
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold ${c.text}`}>$ ···</span>
                  <span className={`w-5 h-5 rounded-full ${c.bg} border ${c.borderSoft} flex items-center justify-center`}>
                    <Plus className={`w-3 h-3 ${c.text}`} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const FILAS_STOCK = [
  { estado: "ok" as const, etiqueta: "En stock" },
  { estado: "bajo" as const, etiqueta: "Pocas unidades" },
  { estado: "ok" as const, etiqueta: "En stock" },
  { estado: "agotado" as const, etiqueta: "Agotado" },
];

function MockupStock({ acento }: { acento: Acento }) {
  const c = ACCENTS[acento];
  const estilos = {
    ok: "bg-emerald-400/10 border-emerald-400/30 text-emerald-400",
    bajo: "bg-yellow-400/10 border-yellow-400/30 text-yellow-400",
    agotado: "bg-neutral-500/10 border-neutral-500/30 text-neutral-400",
  };

  return (
    <div className="relative">
      <Badge className="-top-5 -left-5">
        <PackageCheck className={`w-4 h-4 ${c.text}`} />
        <span className="text-white text-xs font-bold">Stock sincronizado</span>
      </Badge>
      <Badge className="-bottom-5 -right-4">
        <AlertTriangle className={`w-4 h-4 ${c.text}`} />
        <span className="text-white text-xs font-bold">Alerta automática</span>
      </Badge>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center gap-2 mb-5">
          <span className={`w-8 h-8 rounded-lg ${c.bg} border ${c.borderSoft} ${c.text} flex items-center justify-center`}>
            <Boxes className="w-4 h-4" />
          </span>
          <div className="h-2.5 w-32 rounded-full bg-white/10" />
        </div>
        <div className="space-y-3">
          {FILAS_STOCK.map((fila, i) => (
            <div key={i} className="flex items-center justify-between gap-3">
              <div className="h-2.5 flex-1 max-w-[120px] rounded-full bg-white/10" />
              <span className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border ${estilos[fila.estado]}`}>
                {fila.etiqueta}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
