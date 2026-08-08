import type { SupabaseClient } from "@supabase/supabase-js";

// Helpers de lectura compartidos por el panel de administración. Reciben el
// cliente de Supabase como parámetro (server o browser, misma forma) para
// poder usarse tanto desde Server Components como desde secciones "use
// client" que arman su propio fetch on-demand.

export type ProyectoResumen = {
  id: string;
  usuarioId: string;
  clienteNombre: string;
  servicioId: string;
  servicioTitulo: string;
  precioArs: number;
  estado: string;
  suspendido: boolean;
  progreso: number;
  otorgadoEn: string | null;
};

export type ClienteResumen = {
  id: string;
  nombre: string | null;
  email: string;
  activo: boolean;
  estadoCuenta: "activo" | "pausado" | "riesgo";
  creadoEn: string;
  plan: string | null;
  mrr: number;
  proyectos: ProyectoResumen[];
  igSeguidores: number | null;
  igAlcance: number | null;
  igInteracciones: number | null;
};

type ServicioContratadoRow = {
  id: string;
  usuario_id: string;
  servicio_id: string;
  estado: string;
  suspendido: boolean;
  progreso?: number | null;
  otorgado_en?: string | null;
  servicios?: { titulo: string; precio_ars: number } | null;
};

export async function getProyectosResumen(supabase: SupabaseClient): Promise<ProyectoResumen[]> {
  // "*" en vez de listar columnas nuevas (progreso) por nombre: si todavía no
  // se corrió la migración SQL, PostgREST rechaza el select entero cuando pedís
  // una columna que no existe. Con "*" la consulta siempre funciona y leemos
  // `progreso` con `??` más abajo, sea que exista o no.
  const [{ data: contratados, error }, { data: usuarios }] = await Promise.all([
    supabase
      .from("servicios_contratados")
      .select("*, servicios(titulo, precio_ars)")
      .order("otorgado_en", { ascending: false }),
    supabase.from("usuarios").select("id, nombre, email"),
  ]);

  if (error) throw new Error("No pudimos traer los proyectos: " + error.message);

  const nombrePorId = new Map((usuarios || []).map((u: { id: string; nombre: string | null; email: string }) => [u.id, u.nombre || u.email]));

  return ((contratados as unknown as ServicioContratadoRow[]) || []).map((sc) => ({
    id: sc.id,
    usuarioId: sc.usuario_id,
    clienteNombre: nombrePorId.get(sc.usuario_id) || "Cliente",
    servicioId: sc.servicio_id,
    servicioTitulo: sc.servicios?.titulo || "Servicio",
    precioArs: sc.servicios?.precio_ars || 0,
    estado: sc.estado,
    suspendido: sc.suspendido,
    progreso: sc.progreso ?? 0,
    otorgadoEn: sc.otorgado_en ?? null,
  }));
}

export async function getClientesConResumen(supabase: SupabaseClient): Promise<ClienteResumen[]> {
  const [{ data: usuarios, error }, proyectos] = await Promise.all([
    supabase.from("usuarios").select("*").eq("rol", "usuario").order("creado_en", { ascending: false }),
    getProyectosResumen(supabase),
  ]);

  if (error) throw new Error("No pudimos traer los clientes: " + error.message);

  const proyectosPorUsuario = new Map<string, ProyectoResumen[]>();
  proyectos.forEach((p) => {
    const lista = proyectosPorUsuario.get(p.usuarioId) || [];
    lista.push(p);
    proyectosPorUsuario.set(p.usuarioId, lista);
  });

  return (usuarios || []).map((u: Record<string, unknown>) => {
    const propios = proyectosPorUsuario.get(u.id as string) || [];
    const activos = propios.filter((p) => !p.suspendido);
    return {
      id: u.id as string,
      nombre: (u.nombre as string | null) ?? null,
      email: u.email as string,
      activo: u.activo as boolean,
      estadoCuenta: (u.estado_cuenta as ClienteResumen["estadoCuenta"]) ?? "activo",
      creadoEn: u.creado_en as string,
      plan: activos[0]?.servicioTitulo ?? null,
      mrr: activos.reduce((acc, p) => acc + p.precioArs, 0),
      proyectos: propios,
      // "*" ya trae estas columnas si la migración fue corrida; si no existen
      // todavía, quedan undefined y el ?? null las deja en null sin romper nada.
      igSeguidores: (u.ig_seguidores as number | null) ?? null,
      igAlcance: (u.ig_alcance as number | null) ?? null,
      igInteracciones: (u.ig_interacciones as number | null) ?? null,
    };
  });
}

export type FacturacionMensual = { ars: number; usd: number };

// "Facturación mensual" real: suma de facturas con estado "pagada" emitidas
// este mes calendario — plata que efectivamente entró, no el precio de lista
// de los servicios activos (eso ya lo muestra ClienteResumen.mrr, que es un
// concepto distinto: cuánto factura CADA cliente por mes, no cuánto entró).
export async function getFacturacionMensual(supabase: SupabaseClient): Promise<FacturacionMensual> {
  const ahora = new Date();
  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1).toISOString();

  const { data, error } = await supabase
    .from("facturas")
    .select("monto, moneda")
    .eq("estado", "pagada")
    .gte("fecha_emision", inicioMes);

  if (error) throw new Error("No pudimos traer la facturación: " + error.message);

  return (data || []).reduce(
    (acc, f: { monto: number; moneda: string }) => {
      if (f.moneda === "USD") acc.usd += Number(f.monto);
      else acc.ars += Number(f.monto);
      return acc;
    },
    { ars: 0, usd: 0 }
  );
}

export type ConversacionResumen = {
  servicioContratadoId: string;
  clienteId: string;
  clienteNombre: string;
  servicioTitulo: string;
  ultimoMensaje: string | null;
  ultimaFecha: string | null;
  noLeidos: number;
};

export async function getConversaciones(supabase: SupabaseClient): Promise<ConversacionResumen[]> {
  const [{ data: contratados, error }, { data: usuarios }, { data: mensajes }] = await Promise.all([
    supabase.from("servicios_contratados").select("id, usuario_id, servicios(titulo)"),
    supabase.from("usuarios").select("id, nombre, email"),
    supabase.from("mensajes_proyecto").select("*").order("creado_en", { ascending: true }),
  ]);

  if (error) throw new Error("No pudimos traer las conversaciones: " + error.message);

  const nombrePorId = new Map((usuarios || []).map((u: { id: string; nombre: string | null; email: string }) => [u.id, u.nombre || u.email]));

  type MensajeRow = {
    servicio_contratado_id: string;
    autor_rol: "admin" | "cliente";
    leido: boolean;
    texto: string | null;
    archivo_nombre: string | null;
    creado_en: string;
  };

  const mensajesPorProyecto = new Map<string, MensajeRow[]>();
  ((mensajes as MensajeRow[]) || []).forEach((m) => {
    const lista = mensajesPorProyecto.get(m.servicio_contratado_id) || [];
    lista.push(m);
    mensajesPorProyecto.set(m.servicio_contratado_id, lista);
  });

  type ContratadoRow = { id: string; usuario_id: string; servicios?: { titulo: string } | null };

  return ((contratados as unknown as ContratadoRow[]) || [])
    .map((sc) => {
      const propios = mensajesPorProyecto.get(sc.id) || [];
      const ultimo = propios[propios.length - 1];
      return {
        servicioContratadoId: sc.id,
        clienteId: sc.usuario_id,
        clienteNombre: nombrePorId.get(sc.usuario_id) || "Cliente",
        servicioTitulo: sc.servicios?.titulo || "Servicio",
        ultimoMensaje: ultimo ? ultimo.texto || (ultimo.archivo_nombre ? `📎 ${ultimo.archivo_nombre}` : null) : null,
        ultimaFecha: ultimo ? ultimo.creado_en : null,
        noLeidos: propios.filter((m) => m.autor_rol === "cliente" && !m.leido).length,
      };
    })
    .filter((c) => c.ultimaFecha) // solo proyectos con al menos un mensaje
    .sort((a, b) => (b.ultimaFecha! > a.ultimaFecha! ? 1 : -1));
}

export type FacturaConCliente = {
  id: string;
  clienteNombre: string;
  concepto: string;
  monto: number;
  moneda: string;
  estado: string;
  fechaVencimiento: string | null;
};

export async function getFacturasConCliente(supabase: SupabaseClient): Promise<FacturaConCliente[]> {
  const [{ data: facturas, error }, { data: usuarios }] = await Promise.all([
    supabase.from("facturas").select("*").order("fecha_vencimiento", { ascending: false }),
    supabase.from("usuarios").select("id, nombre, email"),
  ]);

  if (error) throw new Error("No pudimos traer las facturas: " + error.message);

  const nombrePorId = new Map((usuarios || []).map((u: { id: string; nombre: string | null; email: string }) => [u.id, u.nombre || u.email]));

  return (facturas || []).map((f: Record<string, unknown>) => ({
    id: f.id as string,
    clienteNombre: nombrePorId.get(f.usuario_id as string) || "Cliente",
    concepto: f.concepto as string,
    monto: Number(f.monto),
    moneda: (f.moneda as string) || "ARS",
    estado: f.estado as string,
    fechaVencimiento: (f.fecha_vencimiento as string | null) ?? null,
  }));
}

export type EventoCalendario = {
  id: string;
  titulo: string;
  clienteNombre: string;
  fechaPublicacion: string;
  estado: string;
  tipo: string;
};

export async function getEventosCalendario(supabase: SupabaseClient): Promise<EventoCalendario[]> {
  const [{ data: posts, error }, { data: contratados }, { data: usuarios }] = await Promise.all([
    supabase.from("posts_calendario").select("*").order("fecha_publicacion", { ascending: true }),
    supabase.from("servicios_contratados").select("id, usuario_id"),
    supabase.from("usuarios").select("id, nombre, email"),
  ]);

  if (error) {
    // La tabla puede no existir todavía si no se corrió la migración —
    // degradamos a "sin eventos" en vez de romper la sección.
    return [];
  }

  const nombrePorId = new Map((usuarios || []).map((u: { id: string; nombre: string | null; email: string }) => [u.id, u.nombre || u.email]));
  const usuarioPorContratado = new Map((contratados || []).map((c: { id: string; usuario_id: string }) => [c.id, c.usuario_id]));

  return (posts || []).map((p: Record<string, unknown>) => {
    const usuarioId = usuarioPorContratado.get(p.servicio_contratado_id as string);
    return {
      id: p.id as string,
      titulo: p.titulo as string,
      clienteNombre: usuarioId ? nombrePorId.get(usuarioId) || "Cliente" : "Cliente",
      fechaPublicacion: p.fecha_publicacion as string,
      estado: p.estado as string,
      tipo: (p.tipo as string) ?? "Post",
    };
  });
}

export type ReporteClienteData = {
  followers: number | null;
  meses: { mes: string; alcance: number; interacciones: number; conversiones: number }[];
};

export async function getReporteCliente(
  supabase: SupabaseClient,
  servicioContratadoId: string
): Promise<ReporteClienteData> {
  const { data, error } = await supabase
    .from("metricas_redes")
    .select("*")
    .eq("servicio_contratado_id", servicioContratadoId)
    .order("mes", { ascending: true });

  if (error) {
    // La tabla puede no existir todavía si no se corrió la migración —
    // degradamos a "sin datos" en vez de romper la sección.
    return { followers: null, meses: [] };
  }

  return {
    followers: null,
    meses: (data || []).map((m: Record<string, unknown>) => ({
      mes: m.mes as string,
      alcance: Number(m.alcance_mensual ?? 0),
      interacciones: Number(m.interacciones ?? 0),
      conversiones: Number(m.conversiones ?? 0),
    })),
  };
}
