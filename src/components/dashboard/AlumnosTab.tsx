"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Paperclip, SendHorizontal, FileText, Image as ImageIcon, Archive, Download, X, UserPlus, Copy, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { enviarMensaje, marcarMensajesLeidos, obtenerUrlArchivo } from "@/lib/mensajes-actions";
import { inferirTipoArchivo, type MensajeProyecto, type TipoArchivoMensaje } from "@/lib/mensajes";
import { ESTADOS_SERVICIO_CONTRATADO, ETIQUETA_ESTADO } from "@/lib/estado-servicio";
import GestionModuloPanel from "@/components/dashboard/GestionModuloPanel";

type Usuario = {
  id: string;
  nombre: string | null;
  email: string;
  rol: string;
  activo: boolean;
  creado_en: string;
};

type Curso = { id: string; titulo: string };
type Recurso = { id: string; titulo: string };
type Servicio = { id: string; titulo: string };

type Inscripcion = {
  id: string;
  usuario_id: string;
  curso_id: string;
  estado: string | null;
  progreso: number;
  cursos?: { titulo: string } | null;
};

type AccesoRecurso = {
  id: string;
  usuario_id: string;
  recurso_id: string;
  recursos?: { titulo: string } | null;
};

// Fuente única de verdad para "servicios contratados": alimenta tanto la ficha
// del alumno (columna 2, con su estado editable) como la lista de chats
// disponibles (columna 3) y el badge de no-leídos (columna 1).
type ServicioContratado = {
  id: string;
  usuario_id: string;
  servicio_id: string;
  estado: string;
  suspendido: boolean;
  servicios?: { titulo: string; modulo: string } | null;
};

type Factura = {
  id: string;
  usuario_id: string;
  servicio_contratado_id: string | null;
  estado: string;
};

type Briefing = {
  plan: string;
  whatsapp: string;
  instagram_url: string;
  facebook_url: string;
  youtube_url: string;
  objetivo_negocio: string;
  cliente_ideal: string;
  gestion_cuenta: string;
  created_at: string;
  credenciales: { servicio: string; usuario: string; clave: string }[];
};

function IconoArchivo({ tipo }: { tipo: TipoArchivoMensaje }) {
  if (tipo === "pdf") return <FileText className="w-5 h-5" />;
  if (tipo === "zip") return <Archive className="w-5 h-5" />;
  return <ImageIcon className="w-5 h-5" />;
}

export default function AlumnosTab() {
  // Datos globales (se cargan una sola vez)
  const [alumnos, setAlumnos] = useState<Usuario[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [serviciosContratados, setServiciosContratados] = useState<ServicioContratado[]>([]);
  const [mensajesPorProyecto, setMensajesPorProyecto] = useState<Record<string, MensajeProyecto[]>>({});
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  // Alta de nuevo alumno (Gestor de Usuarios)
  const [mostrarNuevoAlumno, setMostrarNuevoAlumno] = useState(false);
  const [nombreNuevoAlumno, setNombreNuevoAlumno] = useState("");
  const [emailNuevoAlumno, setEmailNuevoAlumno] = useState("");
  const [creandoAlumno, setCreandoAlumno] = useState(false);
  const [passwordGenerada, setPasswordGenerada] = useState<string | null>(null);

  // Columna 2: alumno seleccionado y su detalle
  const [alumnoSeleccionadoId, setAlumnoSeleccionadoId] = useState<string | null>(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [accesosRecursos, setAccesosRecursos] = useState<AccesoRecurso[]>([]);
  const [procesando, setProcesando] = useState(false);
  const [cursoParaInscribir, setCursoParaInscribir] = useState("");
  const [recursoParaOtorgar, setRecursoParaOtorgar] = useState("");
  const [servicioParaOtorgar, setServicioParaOtorgar] = useState("");

  // Columna 3: chat del servicio elegido
  const [servicioChatId, setServicioChatId] = useState<string | null>(null);
  const [textoMensaje, setTextoMensaje] = useState("");
  const [subiendo, setSubiendo] = useState(false);
  const [mostrarFicha, setMostrarFicha] = useState(false);
  const [briefing, setBriefing] = useState<Briefing | null>(null);
  const [cargandoFicha, setCargandoFicha] = useState(false);
  const [gestionandoServicioId, setGestionandoServicioId] = useState<string | null>(null);
  const [clavesReveladas, setClavesReveladas] = useState<Record<number, boolean>>({});

  const inputArchivoRef = useRef<HTMLInputElement>(null);
  const finMensajesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cargar = async () => {
      const [alumnosRes, cursosRes, recursosRes, serviciosRes, serviciosContratadosRes, mensajesRes, facturasRes] = await Promise.all([
        supabase.from("usuarios").select("*").eq("rol", "alumno").order("creado_en", { ascending: false }),
        supabase.from("cursos").select("id, titulo"),
        supabase.from("recursos").select("id, titulo"),
        supabase.from("servicios").select("id, titulo"),
        supabase.from("servicios_contratados").select("id, usuario_id, servicio_id, estado, suspendido, servicios (titulo, modulo)").order("otorgado_en", { ascending: false }),
        supabase.from("mensajes_proyecto").select("*").order("creado_en", { ascending: true }),
        supabase.from("facturas").select("id, usuario_id, servicio_contratado_id, estado"),
      ]);

      if (alumnosRes.error) console.error("Error al traer alumnos:", alumnosRes.error.message);
      if (serviciosContratadosRes.error) console.error("Error al traer servicios contratados:", serviciosContratadosRes.error.message);
      if (facturasRes.error) console.error("Error al traer facturas:", facturasRes.error.message);
      if (mensajesRes.error) console.error("Error al traer mensajes:", mensajesRes.error.message);

      setAlumnos(alumnosRes.data || []);
      setCursos(cursosRes.data || []);
      setRecursos(recursosRes.data || []);
      setServicios(serviciosRes.data || []);
      setServiciosContratados((serviciosContratadosRes.data as unknown as ServicioContratado[]) || []);
      setFacturas(facturasRes.data || []);

      const agrupados: Record<string, MensajeProyecto[]> = {};
      ((mensajesRes.data as MensajeProyecto[]) || []).forEach((m) => {
        if (!agrupados[m.servicio_contratado_id]) agrupados[m.servicio_contratado_id] = [];
        agrupados[m.servicio_contratado_id].push(m);
      });
      setMensajesPorProyecto(agrupados);
      setCargando(false);
    };
    cargar();
  }, []);

  // Escucha global: un mensaje nuevo puede llegar para cualquier chat de la lista.
  useEffect(() => {
    const canal = supabase
      .channel("mensajes-proyecto-admin")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "mensajes_proyecto" }, (payload) => {
        const nuevo = payload.new as MensajeProyecto;
        setMensajesPorProyecto((prev) => ({
          ...prev,
          [nuevo.servicio_contratado_id]: [...(prev[nuevo.servicio_contratado_id] || []), nuevo],
        }));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, []);

  useEffect(() => {
    finMensajesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [servicioChatId, mensajesPorProyecto]);

  const noLeidosPorProyecto = useMemo(() => {
    const conteo: Record<string, number> = {};
    Object.entries(mensajesPorProyecto).forEach(([id, mensajes]) => {
      conteo[id] = mensajes.filter((m) => m.autor_rol === "cliente" && !m.leido).length;
    });
    return conteo;
  }, [mensajesPorProyecto]);

  const noLeidosPorAlumno = useMemo(() => {
    const conteo: Record<string, number> = {};
    serviciosContratados.forEach((sc) => {
      conteo[sc.usuario_id] = (conteo[sc.usuario_id] || 0) + (noLeidosPorProyecto[sc.id] || 0);
    });
    return conteo;
  }, [serviciosContratados, noLeidosPorProyecto]);

  // Facturas pendientes/vencidas por alumno: para el aviso de "debe plata" en la
  // columna 1 y para mostrar el estado de pago junto a cada servicio.
  const facturasPorServicio = useMemo(() => {
    const conteo: Record<string, Factura[]> = {};
    facturas.forEach((f) => {
      if (!f.servicio_contratado_id) return;
      if (!conteo[f.servicio_contratado_id]) conteo[f.servicio_contratado_id] = [];
      conteo[f.servicio_contratado_id].push(f);
    });
    return conteo;
  }, [facturas]);

  const debePlataPorAlumno = useMemo(() => {
    const conteo: Record<string, boolean> = {};
    facturas.forEach((f) => {
      if (f.estado === "pendiente" || f.estado === "vencida") conteo[f.usuario_id] = true;
    });
    return conteo;
  }, [facturas]);

  const alumnosFiltrados = alumnos.filter((a) =>
    (a.nombre || a.email).toLowerCase().includes(busqueda.toLowerCase())
  );

  const alumnoSeleccionado = alumnos.find((a) => a.id === alumnoSeleccionadoId) || null;
  const serviciosDelAlumno = serviciosContratados.filter((sc) => sc.usuario_id === alumnoSeleccionadoId);
  const servicioChat = serviciosContratados.find((sc) => sc.id === servicioChatId) || null;
  const mensajesActivos = servicioChatId ? mensajesPorProyecto[servicioChatId] || [] : [];

  const abrirChat = async (id: string) => {
    setServicioChatId(id);
    setMostrarFicha(false);

    if ((noLeidosPorProyecto[id] || 0) > 0) {
      setMensajesPorProyecto((prev) => ({
        ...prev,
        [id]: (prev[id] || []).map((m) => (m.autor_rol === "cliente" ? { ...m, leido: true } : m)),
      }));
      await marcarMensajesLeidos(id);
    }
  };

  const seleccionarAlumno = async (usuarioId: string) => {
    setAlumnoSeleccionadoId(usuarioId);
    setServicioChatId(null);
    setMostrarFicha(false);
    setCargandoDetalle(true);

    const [inscripcionesRes, accesosRes] = await Promise.all([
      supabase.from("inscripciones").select(`*, cursos (titulo)`).eq("usuario_id", usuarioId),
      supabase.from("accesos_recursos").select(`*, recursos (titulo)`).eq("usuario_id", usuarioId),
    ]);

    if (inscripcionesRes.error) console.error("Error al traer inscripciones:", inscripcionesRes.error.message);
    if (accesosRes.error) console.error("Error al traer accesos a recursos:", accesosRes.error.message);

    setInscripciones((inscripcionesRes.data as Inscripcion[]) || []);
    setAccesosRecursos((accesosRes.data as AccesoRecurso[]) || []);
    setCargandoDetalle(false);

    // Si tiene un solo servicio contratado, abrimos su chat directo para
    // ahorrar un clic — con más de uno, que el admin elija cuál ver.
    const serviciosDeEsteAlumno = serviciosContratados.filter((sc) => sc.usuario_id === usuarioId);
    if (serviciosDeEsteAlumno.length === 1) {
      await abrirChat(serviciosDeEsteAlumno[0].id);
    }
  };

  const actualizarProgreso = async (inscripcionId: string, progreso: number) => {
    const { error } = await supabase.from("inscripciones").update({ progreso }).eq("id", inscripcionId);
    if (error) {
      alert("Error al actualizar progreso: " + error.message);
      return;
    }
    setInscripciones((prev) => prev.map((i) => (i.id === inscripcionId ? { ...i, progreso } : i)));
  };

  const inscribirEnCurso = async () => {
    if (!cursoParaInscribir || !alumnoSeleccionadoId) return;

    const { data, error } = await supabase
      .from("inscripciones")
      .insert([{ usuario_id: alumnoSeleccionadoId, curso_id: cursoParaInscribir, progreso: 0, estado: "activa" }])
      .select(`*, cursos (titulo)`)
      .single();

    if (error) {
      alert("Error al inscribir: " + error.message);
      return;
    }
    setInscripciones((prev) => [...prev, data as Inscripcion]);
    setCursoParaInscribir("");
  };

  const otorgarRecurso = async () => {
    if (!recursoParaOtorgar || !alumnoSeleccionadoId) return;

    const { data, error } = await supabase
      .from("accesos_recursos")
      .insert([{ usuario_id: alumnoSeleccionadoId, recurso_id: recursoParaOtorgar }])
      .select(`*, recursos (titulo)`)
      .single();

    if (error) {
      alert("Error al otorgar el recurso: " + error.message);
      return;
    }
    setAccesosRecursos((prev) => [...prev, data as AccesoRecurso]);
    setRecursoParaOtorgar("");
  };

  const otorgarServicio = async () => {
    if (!servicioParaOtorgar || !alumnoSeleccionadoId) return;

    const { data, error } = await supabase
      .from("servicios_contratados")
      .insert([{ usuario_id: alumnoSeleccionadoId, servicio_id: servicioParaOtorgar, estado: ESTADOS_SERVICIO_CONTRATADO[0] }])
      .select(`id, usuario_id, servicio_id, estado, suspendido, servicios (titulo, modulo)`)
      .single();

    if (error) {
      alert("Error al asignar el servicio: " + error.message);
      return;
    }
    setServiciosContratados((prev) => [...prev, data as unknown as ServicioContratado]);
    setServicioParaOtorgar("");
  };

  const actualizarEstadoServicio = async (servicioContratadoId: string, estado: string) => {
    const { error } = await supabase.from("servicios_contratados").update({ estado }).eq("id", servicioContratadoId);
    if (error) {
      alert("Error al actualizar el estado: " + error.message);
      return;
    }
    setServiciosContratados((prev) => prev.map((s) => (s.id === servicioContratadoId ? { ...s, estado } : s)));
  };

  const cambiarAcceso = async (usuarioId: string, activarAcceso: boolean) => {
    const confirmacion = activarAcceso
      ? "¿Restaurar el acceso de este alumno?"
      : "¿Revocar el acceso? El alumno no va a poder loguearse ni ver el contenido de sus cursos.";

    if (!confirm(confirmacion)) return;

    setProcesando(true);
    try {
      const res = await fetch("/api/revocar-acceso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuarioId, activar: activarAcceso }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert("Error: " + data.error);
      } else {
        setAlumnos((prev) => prev.map((a) => (a.id === usuarioId ? { ...a, activo: activarAcceso } : a)));
      }
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : "Error desconocido";
      alert("Error de conexión: " + mensaje);
    }
    setProcesando(false);
  };

  const togglearSuspension = async (servicioContratadoId: string, suspender: boolean) => {
    const confirmacion = suspender
      ? "¿Suspender el acceso a este proyecto? El cliente va a dejar de ver los entregables y el chat hasta que lo reactives."
      : "¿Reactivar el acceso a este proyecto?";
    if (!confirm(confirmacion)) return;

    const { error } = await supabase.from("servicios_contratados").update({ suspendido: suspender }).eq("id", servicioContratadoId);
    if (error) return alert("Error al actualizar el acceso: " + error.message);

    setServiciosContratados((prev) => prev.map((s) => (s.id === servicioContratadoId ? { ...s, suspendido: suspender } : s)));
  };

  const generarPasswordTemporal = () => Math.random().toString(36).slice(-6) + Math.floor(Math.random() * 90 + 10);

  const crearAlumno = async () => {
    if (!nombreNuevoAlumno.trim() || !emailNuevoAlumno.trim()) return;
    setCreandoAlumno(true);

    const password = generarPasswordTemporal();
    try {
      const res = await fetch("/api/crear-usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailNuevoAlumno.trim(), nombre: nombreNuevoAlumno.trim(), password }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert("Error: " + data.error);
        setCreandoAlumno(false);
        return;
      }

      setAlumnos((prev) => [
        { id: data.usuarioId, nombre: nombreNuevoAlumno.trim(), email: emailNuevoAlumno.trim(), rol: "alumno", activo: true, creado_en: new Date().toISOString() },
        ...prev,
      ]);
      setPasswordGenerada(password);
      setAlumnoSeleccionadoId(data.usuarioId);
      setInscripciones([]);
      setAccesosRecursos([]);
      setNombreNuevoAlumno("");
      setEmailNuevoAlumno("");
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : "Error desconocido";
      alert("Error de conexión: " + mensaje);
    }
    setCreandoAlumno(false);
  };

  const enviarTexto = async (e: React.FormEvent) => {
    e.preventDefault();
    const texto = textoMensaje.trim();
    if (!texto || !servicioChatId) return;

    setTextoMensaje("");
    const resultado = await enviarMensaje({ servicioContratadoId: servicioChatId, texto });
    if (resultado?.error) alert(resultado.error);
  };

  const adjuntarArchivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (!archivo || !servicioChatId) return;

    setSubiendo(true);
    const tipo = inferirTipoArchivo(archivo);
    const path = `${servicioChatId}/${Date.now()}-${archivo.name}`;

    const { error: errorSubida } = await supabase.storage.from("archivos-proyectos").upload(path, archivo);
    if (errorSubida) {
      alert("Error al subir el archivo: " + errorSubida.message);
      setSubiendo(false);
      e.target.value = "";
      return;
    }

    const resultado = await enviarMensaje({
      servicioContratadoId: servicioChatId,
      archivoNombre: archivo.name,
      archivoTipo: tipo,
      archivoPath: path,
    });
    if (resultado?.error) alert(resultado.error);

    setSubiendo(false);
    e.target.value = "";
  };

  const descargarArchivo = async (path: string) => {
    const resultado = await obtenerUrlArchivo(path);
    if (resultado.error || !resultado.url) {
      alert(resultado.error || "No pudimos generar el link de descarga.");
      return;
    }
    window.open(resultado.url, "_blank", "noopener,noreferrer");
  };

  const abrirFicha = async () => {
    if (!servicioChatId) return;
    setMostrarFicha(true);
    setCargandoFicha(true);
    setClavesReveladas({});

    const { data, error } = await supabase
      .from("briefings")
      .select("plan, whatsapp, instagram_url, facebook_url, youtube_url, objetivo_negocio, cliente_ideal, gestion_cuenta, created_at, credenciales")
      .eq("servicio_contratado_id", servicioChatId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) console.error("Error al traer el briefing:", error.message);
    setBriefing((data as Briefing) || null);
    setCargandoFicha(false);
  };

  const cursosDisponiblesParaInscribir = cursos.filter((c) => !inscripciones.some((i) => i.curso_id === c.id));
  const recursosDisponiblesParaOtorgar = recursos.filter((r) => !accesosRecursos.some((a) => a.recurso_id === r.id));
  const serviciosDisponiblesParaOtorgar = servicios.filter(
    (s) => !serviciosDelAlumno.some((sc) => sc.servicio_id === s.id)
  );

  return (
    <div className="animate-fade-in h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-black">👥 Alumnos</h1>
        <p className="text-neutral-400 text-sm">Elegí un alumno para ver su info y chatear, todo en un solo lugar.</p>
      </div>

      <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl overflow-hidden flex h-[calc(100vh-220px)] min-h-[560px]">
        {/* COLUMNA 1: Lista de alumnos */}
        <div className={`w-full md:w-[24%] border-r border-neutral-800 flex-col ${alumnoSeleccionado ? "hidden md:flex" : "flex"}`}>
          <div className="p-4 border-b border-neutral-800 shrink-0 space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-grow">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar alumno..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white outline-none focus:border-[#ccff00] transition-colors"
                />
              </div>
              <button
                onClick={() => {
                  setMostrarNuevoAlumno((v) => !v);
                  setPasswordGenerada(null);
                }}
                title="Nuevo alumno"
                className="shrink-0 w-10 h-10 rounded-xl bg-[#ccff00]/10 border border-[#ccff00]/30 text-[#ccff00] flex items-center justify-center hover:bg-[#ccff00]/20 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
              </button>
            </div>

            {mostrarNuevoAlumno && (
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 space-y-2">
                {passwordGenerada ? (
                  <div className="space-y-2">
                    <p className="text-xs text-neutral-400">Contraseña temporal (pasásela al cliente, no se vuelve a mostrar):</p>
                    <div className="flex items-center gap-2 bg-neutral-900 border border-[#ccff00]/30 rounded-lg px-3 py-2">
                      <code className="text-[#ccff00] text-sm font-bold flex-grow">{passwordGenerada}</code>
                      <button onClick={() => navigator.clipboard.writeText(passwordGenerada)} className="text-neutral-400 hover:text-white">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        setPasswordGenerada(null);
                        setMostrarNuevoAlumno(false);
                      }}
                      className="w-full text-xs font-bold text-neutral-400 hover:text-white py-1"
                    >
                      Listo
                    </button>
                  </div>
                ) : (
                  <>
                    <input
                      value={nombreNuevoAlumno}
                      onChange={(e) => setNombreNuevoAlumno(e.target.value)}
                      placeholder="Nombre"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#ccff00]"
                    />
                    <input
                      type="email"
                      value={emailNuevoAlumno}
                      onChange={(e) => setEmailNuevoAlumno(e.target.value)}
                      placeholder="Email"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#ccff00]"
                    />
                    <button
                      onClick={crearAlumno}
                      disabled={creandoAlumno || !nombreNuevoAlumno.trim() || !emailNuevoAlumno.trim()}
                      className="w-full bg-[#ccff00] text-black font-bold text-xs py-2 rounded-lg hover:bg-[#b8e600] transition disabled:opacity-40"
                    >
                      {creandoAlumno ? "Creando..." : "Crear alumno"}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex-grow overflow-y-auto divide-y divide-neutral-800">
            {cargando ? (
              <div className="p-8 text-center text-neutral-500 text-sm">Cargando...</div>
            ) : alumnosFiltrados.length === 0 ? (
              <div className="p-8 text-center text-neutral-500 text-sm">Ningún alumno coincide con tu búsqueda.</div>
            ) : (
              alumnosFiltrados.map((alumno) => {
                const nombreAlumno = alumno.nombre || alumno.email;
                const noLeidos = noLeidosPorAlumno[alumno.id] || 0;
                return (
                  <button
                    key={alumno.id}
                    onClick={() => seleccionarAlumno(alumno.id)}
                    className={`w-full p-4 flex items-start gap-3 text-left transition-colors ${
                      alumnoSeleccionadoId === alumno.id ? "bg-[#ccff00]/10" : "hover:bg-neutral-800/40"
                    }`}
                  >
                    <span className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-bold text-neutral-300 shrink-0">
                      {nombreAlumno.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-grow">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-white text-sm truncate">{nombreAlumno}</span>
                        {noLeidos > 0 && (
                          <span className="shrink-0 w-5 h-5 rounded-full bg-[#ccff00] text-black text-[10px] font-black flex items-center justify-center">
                            {noLeidos}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`inline-block mt-0.5 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                            alumno.activo ? "bg-[#ccff00]/20 text-[#ccff00]" : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {alumno.activo ? "Acceso activo" : "Acceso revocado"}
                        </span>
                        {debePlataPorAlumno[alumno.id] && (
                          <span className="inline-block mt-0.5 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-400">
                            💳 Debe pago
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* COLUMNA 2: Ficha del alumno */}
        <div
          className={`w-full md:w-[38%] border-r border-neutral-800 flex-col overflow-y-auto ${
            alumnoSeleccionado && !servicioChat ? "flex" : alumnoSeleccionado ? "hidden lg:flex" : "hidden"
          }`}
        >
          {!alumnoSeleccionado ? (
            <div className="flex-grow flex items-center justify-center text-center p-8">
              <div>
                <span className="text-4xl mb-4 block">👤</span>
                <p className="text-neutral-400">Elegí un alumno de la lista para ver su ficha.</p>
              </div>
            </div>
          ) : (
            <div className="p-5">
              <button
                onClick={() => setAlumnoSeleccionadoId(null)}
                className="md:hidden text-neutral-400 hover:text-white text-sm font-bold flex items-center gap-2 mb-4"
              >
                ← Volver a alumnos
              </button>

              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <span className="font-bold text-white text-lg break-words">{alumnoSeleccionado.nombre || "Sin nombre"}</span>
                <span
                  className={`shrink-0 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    alumnoSeleccionado.activo ? "bg-[#ccff00]/20 text-[#ccff00]" : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {alumnoSeleccionado.activo ? "🟢 Acceso activo" : "🔴 Acceso revocado"}
                </span>
              </div>
              <span className="text-sm text-neutral-500 break-words">{alumnoSeleccionado.email}</span>

              {cargandoDetalle ? (
                <div className="text-center text-neutral-400 py-6">Cargando...</div>
              ) : (
                <>
                  <h4 className="text-xs font-bold uppercase text-neutral-500 mb-4 pt-6 border-t border-neutral-800 mt-6">
                    Progreso por curso
                  </h4>
                  {inscripciones.length === 0 ? (
                    <p className="text-sm text-neutral-500 mb-4">Este alumno no está inscripto en ningún curso todavía.</p>
                  ) : (
                    <div className="space-y-4 mb-6">
                      {inscripciones.map((insc) => (
                        <div key={insc.id}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-bold text-white">{insc.cursos?.titulo || "Curso eliminado"}</span>
                            <span className="text-sm font-bold text-[#ccff00]">{insc.progreso}%</span>
                          </div>
                          <div className="w-full bg-neutral-800 rounded-full h-2 mb-2">
                            <div className="bg-[#ccff00] h-2 rounded-full transition-all" style={{ width: `${insc.progreso}%` }} />
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={insc.progreso}
                            onChange={(e) => actualizarProgreso(insc.id, Number(e.target.value))}
                            className="w-full accent-[#ccff00]"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {cursosDisponiblesParaInscribir.length > 0 && (
                    <div className="flex gap-3 mb-6">
                      <select
                        value={cursoParaInscribir}
                        onChange={(e) => setCursoParaInscribir(e.target.value)}
                        className="flex-grow bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-[#ccff00]"
                      >
                        <option value="">Inscribir en un curso...</option>
                        {cursosDisponiblesParaInscribir.map((c) => (
                          <option key={c.id} value={c.id}>{c.titulo}</option>
                        ))}
                      </select>
                      <button
                        onClick={inscribirEnCurso}
                        disabled={!cursoParaInscribir}
                        className="bg-[#ccff00] text-black font-bold px-4 py-2 rounded-xl text-sm hover:bg-[#b8e600] transition disabled:opacity-40"
                      >
                        Inscribir
                      </button>
                    </div>
                  )}

                  <h4 className="text-xs font-bold uppercase text-neutral-500 mb-4 pt-2 border-t border-neutral-800">
                    Guías y Recursos
                  </h4>
                  {accesosRecursos.length === 0 ? (
                    <p className="text-sm text-neutral-500 mb-4">Este alumno todavía no tiene ninguna guía o recurso otorgado.</p>
                  ) : (
                    <ul className="space-y-2 mb-4">
                      {accesosRecursos.map((acceso) => (
                        <li key={acceso.id} className="text-sm font-bold text-white bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5">
                          📄 {acceso.recursos?.titulo || "Recurso eliminado"}
                        </li>
                      ))}
                    </ul>
                  )}

                  {recursosDisponiblesParaOtorgar.length > 0 && (
                    <div className="flex gap-3 mb-6">
                      <select
                        value={recursoParaOtorgar}
                        onChange={(e) => setRecursoParaOtorgar(e.target.value)}
                        className="flex-grow bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-[#ccff00]"
                      >
                        <option value="">Otorgar una guía o recurso...</option>
                        {recursosDisponiblesParaOtorgar.map((r) => (
                          <option key={r.id} value={r.id}>{r.titulo}</option>
                        ))}
                      </select>
                      <button
                        onClick={otorgarRecurso}
                        disabled={!recursoParaOtorgar}
                        className="bg-[#ccff00] text-black font-bold px-4 py-2 rounded-xl text-sm hover:bg-[#b8e600] transition disabled:opacity-40"
                      >
                        Otorgar
                      </button>
                    </div>
                  )}

                  <h4 className="text-xs font-bold uppercase text-neutral-500 mb-4 pt-2 border-t border-neutral-800">
                    Servicios Contratados
                  </h4>
                  {serviciosDelAlumno.length === 0 ? (
                    <p className="text-sm text-neutral-500 mb-4">Este alumno todavía no tiene ningún servicio contratado.</p>
                  ) : (
                    <div className="space-y-3 mb-4">
                      {serviciosDelAlumno.map((sc) => {
                        const noLeidos = noLeidosPorProyecto[sc.id] || 0;
                        const facturasServicio = facturasPorServicio[sc.id] || [];
                        const tieneFacturaPendiente = facturasServicio.some((f) => f.estado === "pendiente" || f.estado === "vencida");
                        return (
                          <div
                            key={sc.id}
                            onClick={() => abrirChat(sc.id)}
                            className={`flex flex-col gap-2 border rounded-xl px-4 py-3 cursor-pointer transition-colors ${
                              sc.suspendido
                                ? "bg-red-500/5 border-red-500/30"
                                : servicioChatId === sc.id
                                ? "bg-[#ccff00]/10 border-[#ccff00]/40"
                                : "bg-neutral-900 border-neutral-800 hover:border-[#ccff00]/30"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-bold text-white flex items-center gap-2">
                                🛠️ {sc.servicios?.titulo || "Servicio eliminado"}
                              </span>
                              {noLeidos > 0 && (
                                <span className="shrink-0 w-5 h-5 rounded-full bg-[#ccff00] text-black text-[10px] font-black flex items-center justify-center">
                                  {noLeidos}
                                </span>
                              )}
                            </div>
                            {(sc.suspendido || tieneFacturaPendiente) && (
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {sc.suspendido && (
                                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">
                                    🚫 Suspendido
                                  </span>
                                )}
                                {tieneFacturaPendiente && (
                                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-400">
                                    💳 Pago pendiente
                                  </span>
                                )}
                              </div>
                            )}
                            <div className="flex items-center gap-2 flex-wrap">
                              <select
                                value={sc.estado}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => actualizarEstadoServicio(sc.id, e.target.value)}
                                className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs font-bold text-[#ccff00] outline-none focus:border-[#ccff00] w-fit"
                              >
                                {ESTADOS_SERVICIO_CONTRATADO.map((estado) => (
                                  <option key={estado} value={estado}>{ETIQUETA_ESTADO[estado]}</option>
                                ))}
                              </select>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setGestionandoServicioId(sc.id);
                                }}
                                className="bg-neutral-950 border border-neutral-800 hover:border-[#ccff00]/40 text-neutral-300 hover:text-[#ccff00] text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                              >
                                ⚙️ Gestionar entregables
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglearSuspension(sc.id, !sc.suspendido);
                                }}
                                className={`border text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                                  sc.suspendido
                                    ? "bg-neutral-950 border-neutral-800 text-[#ccff00] hover:border-[#ccff00]/40"
                                    : "bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-red-500/40 hover:text-red-400"
                                }`}
                              >
                                {sc.suspendido ? "✅ Reactivar" : "🚫 Suspender"}
                              </button>
                            </div>
                            <span className="text-[10px] text-neutral-500 font-bold uppercase">
                              {servicioChatId === sc.id ? "Viendo este chat →" : "Tocá para ver el chat →"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {serviciosDisponiblesParaOtorgar.length > 0 && (
                    <div className="flex gap-3 mb-6">
                      <select
                        value={servicioParaOtorgar}
                        onChange={(e) => setServicioParaOtorgar(e.target.value)}
                        className="flex-grow bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-[#ccff00]"
                      >
                        <option value="">Asignar un servicio...</option>
                        {serviciosDisponiblesParaOtorgar.map((s) => (
                          <option key={s.id} value={s.id}>{s.titulo}</option>
                        ))}
                      </select>
                      <button
                        onClick={otorgarServicio}
                        disabled={!servicioParaOtorgar}
                        className="bg-[#ccff00] text-black font-bold px-4 py-2 rounded-xl text-sm hover:bg-[#b8e600] transition disabled:opacity-40"
                      >
                        Asignar
                      </button>
                    </div>
                  )}

                  <div className="border-t border-neutral-800 pt-4 flex justify-end">
                    {alumnoSeleccionado.activo ? (
                      <button
                        onClick={() => cambiarAcceso(alumnoSeleccionado.id, false)}
                        disabled={procesando}
                        className="bg-red-500/10 border border-red-500/40 text-red-400 font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-red-500/20 transition disabled:opacity-40"
                      >
                        {procesando ? "Procesando..." : "🚫 Revocar acceso"}
                      </button>
                    ) : (
                      <button
                        onClick={() => cambiarAcceso(alumnoSeleccionado.id, true)}
                        disabled={procesando}
                        className="bg-[#ccff00]/10 border border-[#ccff00]/40 text-[#ccff00] font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#ccff00]/20 transition disabled:opacity-40"
                      >
                        {procesando ? "Procesando..." : "✅ Restaurar acceso"}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* COLUMNA 3: Chat del servicio elegido */}
        <div className={`w-full md:w-[38%] flex-col ${servicioChat ? "flex" : "hidden lg:flex"}`}>
          {!servicioChat ? (
            <div className="flex-grow flex items-center justify-center text-center p-8">
              <div>
                <span className="text-4xl mb-4 block">💬</span>
                <p className="text-neutral-400">
                  {alumnoSeleccionado ? "Elegí un servicio del alumno para ver la conversación." : "Elegí un alumno de la lista."}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3 p-4 border-b border-neutral-800 bg-neutral-950/50 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => setServicioChatId(null)}
                    className="lg:hidden shrink-0 text-neutral-400 hover:text-white p-1 -ml-1"
                    aria-label="Volver a la ficha"
                  >
                    ←
                  </button>
                  <div className="min-w-0">
                    <p className="font-bold text-white text-sm truncate">{alumnoSeleccionado?.nombre || alumnoSeleccionado?.email}</p>
                    <p className="text-xs text-neutral-500 truncate">{servicioChat.servicios?.titulo}</p>
                  </div>
                </div>
                <button
                  onClick={abrirFicha}
                  className="shrink-0 bg-neutral-900 border border-neutral-800 hover:border-[#ccff00]/50 text-neutral-300 hover:text-[#ccff00] text-xs font-bold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
                >
                  Ver ficha del proyecto
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-4 space-y-3">
                {mensajesActivos.length === 0 && (
                  <p className="text-center text-neutral-500 text-sm py-8">Todavía no hay mensajes con este cliente.</p>
                )}
                {mensajesActivos.map((msg) => {
                  const esAdmin = msg.autor_rol === "admin";
                  const hora = new Date(msg.creado_en).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
                  return (
                    <div key={msg.id} className={`flex ${esAdmin ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 ${
                          esAdmin ? "bg-[#ccff00] text-black rounded-br-sm" : "bg-neutral-800 text-white rounded-bl-sm"
                        }`}
                      >
                        {msg.texto && <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.texto}</p>}
                        {msg.archivo_nombre && msg.archivo_path && (
                          <div className={`flex items-center gap-3 rounded-xl p-3 ${esAdmin ? "bg-black/10" : "bg-neutral-950/60"}`}>
                            <span
                              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                                esAdmin ? "bg-black/10 text-black" : "bg-neutral-800 text-[#ccff00]"
                              }`}
                            >
                              <IconoArchivo tipo={msg.archivo_tipo || "imagen"} />
                            </span>
                            <span className="min-w-0 flex-grow text-sm font-medium truncate">{msg.archivo_nombre}</span>
                            <button onClick={() => descargarArchivo(msg.archivo_path!)} className="shrink-0" aria-label="Descargar">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        <p className={`text-[10px] mt-1 text-right ${esAdmin ? "text-black/50" : "text-neutral-500"}`}>{hora}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={finMensajesRef} />
              </div>

              <div className="border-t border-neutral-800 p-3 shrink-0">
                <form onSubmit={enviarTexto} className="flex items-center gap-2">
                  <input
                    ref={inputArchivoRef}
                    type="file"
                    accept="image/*,application/pdf,.zip"
                    onChange={adjuntarArchivo}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => inputArchivoRef.current?.click()}
                    disabled={subiendo}
                    title="Adjuntar PDF, PNG, JPG o ZIP — sin pérdida de calidad"
                    className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-neutral-400 hover:text-[#ccff00] hover:bg-neutral-800 transition-colors disabled:opacity-40"
                    aria-label="Adjuntar archivo"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    value={textoMensaje}
                    onChange={(e) => setTextoMensaje(e.target.value)}
                    placeholder={subiendo ? "Subiendo archivo..." : "Escribí un mensaje..."}
                    disabled={subiendo}
                    className="flex-grow bg-neutral-950 border border-neutral-800 rounded-full px-4 py-2.5 text-sm text-white outline-none focus:border-[#ccff00] transition-colors disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={!textoMensaje.trim() || subiendo}
                    className="shrink-0 w-10 h-10 rounded-full bg-[#ccff00] text-black flex items-center justify-center hover:bg-[#b8e600] transition-colors disabled:opacity-40"
                    aria-label="Enviar"
                  >
                    <SendHorizontal className="w-4 h-4" />
                  </button>
                </form>
                <p className="text-[10px] text-neutral-600 mt-2 text-center">
                  Adjuntá PDF, PNG, JPG o ZIP — se envían sin pérdida de calidad.
                </p>
              </div>
            </>
          )}
        </div>

        {/* PANEL: Ficha del proyecto (briefing) */}
        {mostrarFicha && servicioChat && (
          <div className="absolute inset-0 z-10 flex justify-end">
            <div className="absolute inset-0 bg-black/60" onClick={() => setMostrarFicha(false)} />
            <div className="relative w-full sm:w-[420px] h-full bg-neutral-950 border-l border-neutral-800 overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-black text-white">Ficha del Proyecto</h2>
                <button onClick={() => setMostrarFicha(false)} className="text-neutral-500 hover:text-white transition-colors" aria-label="Cerrar">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cargandoFicha ? (
                <p className="text-neutral-400 text-sm">Cargando...</p>
              ) : !briefing ? (
                <p className="text-neutral-400 text-sm">
                  {alumnoSeleccionado?.nombre || "Este cliente"} todavía no completó el formulario base.
                </p>
              ) : (
                <div className="space-y-6">
                  {servicioChat?.estado === "Esperando información" && (
                    <button
                      onClick={() => servicioChatId && actualizarEstadoServicio(servicioChatId, "Diseño")}
                      className="w-full bg-[#ccff00] text-black font-bold text-sm py-2.5 rounded-xl hover:bg-[#b8e600] transition-colors"
                    >
                      ✅ Aprobar Brief → pasar a Diseño
                    </button>
                  )}
                  <div>
                    <p className="text-xs font-bold uppercase text-neutral-500 mb-1">Plan</p>
                    <p className="text-white font-bold">{briefing.plan}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-neutral-500 mb-1">WhatsApp</p>
                    <p className="text-white">{briefing.whatsapp || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-neutral-500 mb-2">Plataformas</p>
                    <ul className="space-y-1 text-sm">
                      <li className="text-neutral-300"><span className="text-neutral-500">Instagram:</span> {briefing.instagram_url || "—"}</li>
                      <li className="text-neutral-300"><span className="text-neutral-500">Facebook:</span> {briefing.facebook_url || "—"}</li>
                      <li className="text-neutral-300"><span className="text-neutral-500">YouTube:</span> {briefing.youtube_url || "—"}</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-neutral-500 mb-1">Objetivo del negocio</p>
                    <p className="text-neutral-300 text-sm whitespace-pre-wrap">{briefing.objetivo_negocio || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-neutral-500 mb-1">Cliente ideal</p>
                    <p className="text-neutral-300 text-sm whitespace-pre-wrap">{briefing.cliente_ideal || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-neutral-500 mb-1">Gestión de cuenta</p>
                    <p className="text-neutral-300 text-sm">
                      {briefing.gestion_cuenta === "agencia" ? "La agencia administra y publica el contenido." : "El cliente se encarga de publicar."}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-neutral-500 mb-1">Enviado el</p>
                    <p className="text-neutral-300 text-sm">
                      {new Date(briefing.created_at).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })}
                    </p>
                  </div>

                  {briefing.credenciales?.length > 0 && (
                    <div>
                      <p className="text-xs font-bold uppercase text-neutral-500 mb-2">🔐 Accesos que dejó el cliente</p>
                      <div className="space-y-2">
                        {briefing.credenciales.map((cred, i) => (
                          <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-xl p-3">
                            <p className="text-xs font-bold text-white mb-1">{cred.servicio}</p>
                            <p className="text-xs text-neutral-400 mb-1">Usuario: {cred.usuario || "—"}</p>
                            <div className="flex items-center gap-2">
                              <code className="text-xs text-neutral-300 flex-grow">
                                {clavesReveladas[i] ? cred.clave || "—" : "•".repeat(Math.max(cred.clave?.length || 8, 6))}
                              </code>
                              <button
                                onClick={() => setClavesReveladas((prev) => ({ ...prev, [i]: !prev[i] }))}
                                className="text-neutral-500 hover:text-white shrink-0"
                                aria-label="Mostrar/ocultar clave"
                              >
                                {clavesReveladas[i] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                onClick={() => cred.clave && navigator.clipboard.writeText(cred.clave)}
                                className="text-neutral-500 hover:text-white shrink-0"
                                aria-label="Copiar clave"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* PANEL: Gestionar entregables del módulo (accesos web, calendario, métricas, brand kit) */}
        {gestionandoServicioId &&
          (() => {
            const servicio = serviciosContratados.find((sc) => sc.id === gestionandoServicioId);
            if (!servicio) return null;
            return (
              <GestionModuloPanel
                servicioContratadoId={servicio.id}
                usuarioId={servicio.usuario_id}
                nombreServicio={servicio.servicios?.titulo || "Servicio"}
                modulo={servicio.servicios?.modulo || "otro"}
                onCerrar={() => setGestionandoServicioId(null)}
              />
            );
          })()}
      </div>
    </div>
  );
}
