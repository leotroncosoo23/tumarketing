"use client";

import { motion, type Variants } from "framer-motion";
import { MonitorSmartphone, Database, Workflow } from "lucide-react";

const servicios = [
  {
    icon: MonitorSmartphone,
    titulo: "Webs de Alto Rendimiento",
    texto:
      "Páginas corporativas y tiendas ultrarrápidas construidas con las últimas tecnologías del mercado (React y Next.js) para que nunca pierdas un cliente por tiempos de carga.",
  },
  {
    icon: Database,
    titulo: "Sistemas de Gestión a Medida",
    texto:
      "Olvidate de los Excel interminables. Creamos paneles de administración propios y bases de datos robustas (SQL) para gestionar tu stock, clientes o turnos en tiempo real.",
  },
  {
    icon: Workflow,
    titulo: "Integraciones y Automatización",
    texto:
      "Conectamos tu web con plataformas de pago, envíos y correos automáticos para que tu negocio funcione en piloto automático.",
  },
];

const contenedor: Variants = {
  oculto: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const tarjeta: Variants = {
  oculto: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function Servicios() {
  return (
    <section className="relative bg-slate-950 text-white py-24 md:py-32 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            Soluciones tecnológicas para escalar tu empresa
          </h2>
          <p className="text-neutral-400 text-lg">
            Ingeniería de software aplicada a resultados comerciales
          </p>
        </motion.div>

        <motion.div
          initial="oculto"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={contenedor}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {servicios.map(({ icon: Icon, titulo, texto }) => (
            <motion.div
              key={titulo}
              variants={tarjeta}
              className="group relative bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400/50 hover:shadow-[0_0_40px_rgba(34,211,238,0.25)]"
            >
              <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 transition-colors duration-300 group-hover:bg-cyan-400/20">
                <Icon className="w-7 h-7" strokeWidth={1.75} />
              </div>
              <h3 className="text-xl font-bold mb-3">{titulo}</h3>
              <p className="text-neutral-400 leading-relaxed">{texto}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
