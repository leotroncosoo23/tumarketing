"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type Usuario = {
  id: string;
  nombre: string | null;
  email: string;
  rol: string;
  activo: boolean;
  creado_en: string;
};

type Curso = {
  id: string;
  titulo: string;
};

type Recurso = {
  id: string;
  titulo: string;
};

type Servicio = {
  id: string;
  titulo: string;
};

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

type ServicioContratado = {
  id: string;
  usuario_id: string;
  servicio_id: string;
  estado: string;
  servicios?: { titulo: string } | null;
};

const ESTADOS_SERVICIO_CONTRATADO = ["Esperando información", "En Desarrollo", "En Revisión"];

export default function AlumnoTab() {
  const [alumnos, setAlumnos] = useState<Usuario[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [cargando, setCargando] = useState(false);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<string | null>(null);
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [accesosRecursos, setAccesosRecursos] = useState<AccesoRecurso[]>([]);
  const [serviciosContratados, setServiciosContratados] = useState<ServicioContratado[]>([]);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [cursoParaInscribir, setCursoParaInscribir] = useState("");
  const [recursoParaOtorgar, setRecursoParaOtorgar] = useState("");
  const [servicioParaOtorgar, setServicioParaOtorgar] = useState("");

  const fetchAlumnos = async () => {
    setCargando(true);
    // Solo traemos usuarios con rol "alumno" (dejamos afuera cuentas admin, como la tuya)
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("rol", "alumno")
      .order("creado_en", { ascending: false });

    if (error) console.error("Error al traer alumnos:", error.message);
    setAlumnos(data || []);
    setCargando(false);
  };

  const fetchCursos = async () => {
    const { data } = await supabase.from("cursos").select("id, titulo");
    setCursos(data || []);
  };

  const fetchRecursos = async () => {
    const { data } = await supabase.from("recursos").select("id, titulo");
    setRecursos(data || []);
  };

  const fetchServicios = async () => {
    const { data } = await supabase.from("servicios").select("id, titulo");
    setServicios(data || []);
  };

  useEffect(() => {
    fetchAlumnos();
    fetchCursos();
    fetchRecursos();
    fetchServicios();
  }, []);

  const abrirDetalle = async (usuarioId: string) => {
    if (alumnoSeleccionado === usuarioId) {
      setAlumnoSeleccionado(null);
      return;
    }
    setAlumnoSeleccionado(usuarioId);
    setCargandoDetalle(true);

    const [inscripcionesRes, accesosRes, serviciosRes] = await Promise.all([
      supabase.from("inscripciones").select(`*, cursos (titulo)`).eq("usuario_id", usuarioId),
      supabase.from("accesos_recursos").select(`*, recursos (titulo)`).eq("usuario_id", usuarioId),
      supabase.from("servicios_contratados").select(`*, servicios (titulo)`).eq("usuario_id", usuarioId),
    ]);

    if (inscripcionesRes.error) console.error("Error al traer inscripciones:", inscripcionesRes.error.message);
    if (accesosRes.error) console.error("Error al traer accesos a recursos:", accesosRes.error.message);
    if (serviciosRes.error) console.error("Error al traer servicios contratados:", serviciosRes.error.message);

    setInscripciones((inscripcionesRes.data as Inscripcion[]) || []);
    setAccesosRecursos((accesosRes.data as AccesoRecurso[]) || []);
    setServiciosContratados((serviciosRes.data as ServicioContratado[]) || []);
    setCargandoDetalle(false);
  };

  const actualizarProgreso = async (inscripcionId: string, progreso: number) => {
    const { error } = await supabase
      .from("inscripciones")
      .update({ progreso })
      .eq("id", inscripcionId);

    if (error) {
      alert("Error al actualizar progreso: " + error.message);
      return;
    }
    setInscripciones((prev) =>
      prev.map((i) => (i.id === inscripcionId ? { ...i, progreso } : i))
    );
  };

  const inscribirEnCurso = async () => {
    if (!cursoParaInscribir || !alumnoSeleccionado) return;

    const { data, error } = await supabase
      .from("inscripciones")
      .insert([
        {
          usuario_id: alumnoSeleccionado,
          curso_id: cursoParaInscribir,
          progreso: 0,
          estado: "activa",
        },
      ])
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
    if (!recursoParaOtorgar || !alumnoSeleccionado) return;

    const { data, error } = await supabase
      .from("accesos_recursos")
      .insert([{ usuario_id: alumnoSeleccionado, recurso_id: recursoParaOtorgar }])
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
    if (!servicioParaOtorgar || !alumnoSeleccionado) return;

    const { data, error } = await supabase
      .from("servicios_contratados")
      .insert([{ usuario_id: alumnoSeleccionado, servicio_id: servicioParaOtorgar, estado: ESTADOS_SERVICIO_CONTRATADO[0] }])
      .select(`*, servicios (titulo)`)
      .single();

    if (error) {
      alert("Error al asignar el servicio: " + error.message);
      return;
    }
    setServiciosContratados((prev) => [...prev, data as ServicioContratado]);
    setServicioParaOtorgar("");
  };

  const actualizarEstadoServicio = async (servicioContratadoId: string, estado: string) => {
    const { error } = await supabase
      .from("servicios_contratados")
      .update({ estado })
      .eq("id", servicioContratadoId);

    if (error) {
      alert("Error al actualizar el estado: " + error.message);
      return;
    }
    setServiciosContratados((prev) =>
      prev.map((s) => (s.id === servicioContratadoId ? { ...s, estado } : s))
    );
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
        setAlumnos((prev) =>
          prev.map((a) => (a.id === usuarioId ? { ...a, activo: activarAcceso } : a))
        );
      }
    } catch (err: any) {
      alert("Error de conexión: " + err.message);
    }
    setProcesando(false);
  };

  const cursosDisponiblesParaInscribir = cursos.filter(
    (c) => !inscripciones.some((i) => i.curso_id === c.id)
  );
  const recursosDisponiblesParaOtorgar = recursos.filter(
    (r) => !accesosRecursos.some((a) => a.recurso_id === r.id)
  );
  const serviciosDisponiblesParaOtorgar = servicios.filter(
    (s) => !serviciosContratados.some((sc) => sc.servicio_id === s.id)
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-black">👥 Lista de Alumnos</h1>
        <p className="text-neutral-400 text-sm">
          Hacé clic en un alumno para ver su progreso y gestionar su acceso.
        </p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-neutral-800 flex justify-between items-center bg-neutral-950/50">
          <span className="font-bold text-sm uppercase tracking-wider text-neutral-300">
            Alumnos Registrados ({alumnos.length})
          </span>
          {cargando && (
            <span className="text-xs text-[#ccff00] animate-pulse font-bold">Cargando...</span>
          )}
        </div>

        <div className="divide-y divide-neutral-800">
          {alumnos.length === 0 && !cargando ? (
            <div className="p-12 text-center text-neutral-400">
              Todavía no hay alumnos registrados.
            </div>
          ) : (
            alumnos.map((alumno) => (
              <div key={alumno.id}>
                <button
                  onClick={() => abrirDetalle(alumno.id)}
                  className="w-full p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-4 hover:bg-neutral-800/40 transition-colors text-left"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <span className="font-bold text-white text-lg break-words">
                        {alumno.nombre || "Sin nombre"}
                      </span>
                      <span
                        className={`shrink-0 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          alumno.activo
                            ? "bg-[#ccff00]/20 text-[#ccff00]"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {alumno.activo ? "🟢 Acceso activo" : "🔴 Acceso revocado"}
                      </span>
                    </div>
                    <span className="text-sm text-neutral-500 break-words">{alumno.email}</span>
                  </div>
                  <span className="shrink-0 text-neutral-500 text-sm">
                    {alumnoSeleccionado === alumno.id ? "▲ Cerrar" : "▼ Ver detalle"}
                  </span>
                </button>

                {alumnoSeleccionado === alumno.id && (
                  <div className="bg-neutral-950/60 p-6 border-t border-neutral-800">
                    {cargandoDetalle ? (
                      <div className="text-center text-neutral-400 py-6">Cargando progreso...</div>
                    ) : (
                      <>
                        <h4 className="text-xs font-bold uppercase text-neutral-500 mb-4">
                          Progreso por curso
                        </h4>

                        {inscripciones.length === 0 ? (
                          <p className="text-sm text-neutral-500 mb-4">
                            Este alumno no está inscripto en ningún curso todavía.
                          </p>
                        ) : (
                          <div className="space-y-4 mb-6">
                            {inscripciones.map((insc) => (
                              <div key={insc.id}>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-bold text-white">
                                    {insc.cursos?.titulo || "Curso eliminado"}
                                  </span>
                                  <span className="text-sm font-bold text-[#ccff00]">
                                    {insc.progreso}%
                                  </span>
                                </div>
                                <div className="w-full bg-neutral-800 rounded-full h-2 mb-2">
                                  <div
                                    className="bg-[#ccff00] h-2 rounded-full transition-all"
                                    style={{ width: `${insc.progreso}%` }}
                                  />
                                </div>
                                <input
                                  type="range"
                                  min={0}
                                  max={100}
                                  value={insc.progreso}
                                  onChange={(e) =>
                                    actualizarProgreso(insc.id, Number(e.target.value))
                                  }
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
                                <option key={c.id} value={c.id}>
                                  {c.titulo}
                                </option>
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

                        {/* Guías y Recursos otorgados */}
                        <h4 className="text-xs font-bold uppercase text-neutral-500 mb-4 pt-2 border-t border-neutral-800">
                          Guías y Recursos
                        </h4>

                        {accesosRecursos.length === 0 ? (
                          <p className="text-sm text-neutral-500 mb-4">
                            Este alumno todavía no tiene ninguna guía o recurso otorgado.
                          </p>
                        ) : (
                          <ul className="space-y-2 mb-4">
                            {accesosRecursos.map((acceso) => (
                              <li
                                key={acceso.id}
                                className="text-sm font-bold text-white bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5"
                              >
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
                                <option key={r.id} value={r.id}>
                                  {r.titulo}
                                </option>
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

                        {/* Servicios contratados */}
                        <h4 className="text-xs font-bold uppercase text-neutral-500 mb-4 pt-2 border-t border-neutral-800">
                          Servicios Contratados
                        </h4>

                        {serviciosContratados.length === 0 ? (
                          <p className="text-sm text-neutral-500 mb-4">
                            Este alumno todavía no tiene ningún servicio contratado.
                          </p>
                        ) : (
                          <div className="space-y-3 mb-4">
                            {serviciosContratados.map((sc) => (
                              <div
                                key={sc.id}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3"
                              >
                                <span className="text-sm font-bold text-white">
                                  🛠️ {sc.servicios?.titulo || "Servicio eliminado"}
                                </span>
                                <select
                                  value={sc.estado}
                                  onChange={(e) => actualizarEstadoServicio(sc.id, e.target.value)}
                                  className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs font-bold text-[#ccff00] outline-none focus:border-[#ccff00] w-fit"
                                >
                                  {ESTADOS_SERVICIO_CONTRATADO.map((estado) => (
                                    <option key={estado} value={estado}>
                                      {estado}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            ))}
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
                                <option key={s.id} value={s.id}>
                                  {s.titulo}
                                </option>
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
                          {alumno.activo ? (
                            <button
                              onClick={() => cambiarAcceso(alumno.id, false)}
                              disabled={procesando}
                              className="bg-red-500/10 border border-red-500/40 text-red-400 font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-red-500/20 transition disabled:opacity-40"
                            >
                              {procesando ? "Procesando..." : "🚫 Revocar acceso"}
                            </button>
                          ) : (
                            <button
                              onClick={() => cambiarAcceso(alumno.id, true)}
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}