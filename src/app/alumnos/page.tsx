"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useAlumnoSession } from "@/lib/useAlumnoSession";
import { generarDiplomaPDF } from "@/lib/diploma";
import { iniciales } from "@/lib/iniciales";
import { CURSOS_HABILITADO } from "@/lib/feature-flags";
import CircularProgress from "@/components/alumnos/CircularProgress";

type Inscripcion = {
  id: string;
  progreso: number;
  cursos: {
    id: string;
    titulo: string;
    imagen_url: string;
    modalidad: string;
  } | null;
  leccion_actual: { titulo: string } | null;
};

type Vista = "inicio" | "certificados" | "proyectos";

type EstadoServicioCliente = "Esperando información" | "En Desarrollo" | "En Revisión";

type ServicioActivo = {
  id: string;
  nombre: string;
  estado: EstadoServicioCliente;
};

const ESTADO_ESTILOS: Record<EstadoServicioCliente, string> = {
  "Esperando información": "bg-amber-400/10 text-amber-400 border border-amber-400/30",
  "En Desarrollo": "bg-blue-400/10 text-blue-400 border border-blue-400/30",
  "En Revisión": "bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30",
};

function accionServicio(estado: EstadoServicioCliente) {
  return estado === "Esperando información" ? "Completar Formulario Base" : "Ver Entregables";
}

function TarjetaServicio({ servicio }: { servicio: ServicioActivo }) {
  return (
    <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 hover:border-[#ccff00]/40 transition-colors flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <span className="w-11 h-11 rounded-xl bg-[#ccff00]/10 text-[#ccff00] flex items-center justify-center text-xl shrink-0">
          🛠️
        </span>
        <span
          className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${ESTADO_ESTILOS[servicio.estado]}`}
        >
          {servicio.estado}
        </span>
      </div>
      <h3 className="font-bold text-white text-base leading-snug">{servicio.nombre}</h3>
      {servicio.estado === "Esperando información" ? (
        <Link
          href={`/alumnos/onboarding?servicio=${encodeURIComponent(servicio.nombre)}&scid=${servicio.id}`}
          className="mt-auto w-full text-center bg-[#ccff00] text-black text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-[#b8e600] transition-colors"
        >
          {accionServicio(servicio.estado)}
        </Link>
      ) : (
        <Link
          href={`/alumnos/proyectos/${servicio.id}`}
          className="mt-auto w-full text-center bg-[#ccff00] text-black text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-[#b8e600] transition-colors"
        >
          {accionServicio(servicio.estado)}
        </Link>
      )}
    </div>
  );
}

export default function AlumnosDashboard() {
  const router = useRouter();
  const { perfil, usuario, cargando } = useAlumnoSession();

  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [cargandoCursos, setCargandoCursos] = useState(true);
  const [serviciosActivos, setServiciosActivos] = useState<ServicioActivo[]>([]);
  const [config, setConfig] = useState<{ whatsapp_numero: string; whatsapp_comunidad_url: string; discord_url: string } | null>(null);

  const [vista, setVista] = useState<Vista>("inicio");
  const [mostrarTipo, setMostrarTipo] = useState<"cursando" | "finalizados">("cursando");
  const [indiceDestacado, setIndiceDestacado] = useState(0);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [colapsado, setColapsado] = useState(false);

  useEffect(() => {
    if (!perfil) return;

    // Cursos deshabilitado (ver feature-flags.ts): no tiene sentido pedirle
    // datos a Supabase para una sección que no se muestra.
    if (!CURSOS_HABILITADO) {
      setCargandoCursos(false);
    } else {
      const fetchInscripciones = async () => {
        const { data, error } = await supabase
          .from("inscripciones")
          .select("id, progreso, cursos (id, titulo, imagen_url, modalidad), leccion_actual:lecciones!ultima_leccion_id (titulo)")
          .eq("usuario_id", perfil.id);

        if (error) console.error("Error al traer tus cursos:", error.message);
        setInscripciones((data as unknown as Inscripcion[]) || []);
        setCargandoCursos(false);
      };
      fetchInscripciones();
    }

    const fetchServiciosActivos = async () => {
      const { data, error } = await supabase
        .from("servicios_contratados")
        .select("id, estado, servicios (titulo)")
        .eq("usuario_id", perfil.id);

      if (error) {
        console.error("Error al traer tus servicios:", error.message);
        return;
      }
      setServiciosActivos(
        (data || []).map((sc: any) => ({
          id: sc.id,
          nombre: sc.servicios?.titulo || "Servicio eliminado",
          estado: sc.estado as EstadoServicioCliente,
        }))
      );
    };
    fetchServiciosActivos();

    const fetchConfig = async () => {
      const { data } = await supabase
        .from("configuracion")
        .select("whatsapp_numero, whatsapp_comunidad_url, discord_url")
        .eq("id", 1)
        .single();
      setConfig(data || null);
    };
    fetchConfig();
  }, [perfil]);

  useEffect(() => {
    setIndiceDestacado(0);
  }, [mostrarTipo]);

  const handleCerrarSesion = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  if (cargando) {
    return (
      <main className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <p className="text-neutral-400">Cargando...</p>
      </main>
    );
  }
  if (!perfil) return null;

  const activos = inscripciones.filter((i) => i.progreso < 100);
  const finalizados = inscripciones.filter((i) => i.progreso >= 100);
  const listaSegunTipo = mostrarTipo === "cursando" ? activos : finalizados;
  const destacado = listaSegunTipo[indiceDestacado] || null;

  const avanzar = (dir: 1 | -1) => {
    if (listaSegunTipo.length === 0) return;
    setIndiceDestacado((prev) => (prev + dir + listaSegunTipo.length) % listaSegunTipo.length);
  };

  const whatsappConsultaLimpio = (config?.whatsapp_numero || "").replace(/\D/g, "");
  const linkConsulta = whatsappConsultaLimpio
    ? `https://wa.me/${whatsappConsultaLimpio}?text=${encodeURIComponent("Hola! Tengo una consulta sobre mi curso 🙋")}`
    : null;
  const linkAsesoria = whatsappConsultaLimpio
    ? `https://wa.me/${whatsappConsultaLimpio}?text=${encodeURIComponent("Hola! Quiero agendar una asesoría con el equipo 🗓️")}`
    : null;

  const avatarUrl = usuario?.user_metadata?.avatar_url as string | undefined;
  const nombreMostrado = perfil.nombre || perfil.email;

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans flex overflow-x-hidden">
      {/* Overlay mobile */}
      {menuAbierto && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setMenuAbierto(false)} />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-neutral-900 border-r border-neutral-800 flex flex-col justify-between transition-all duration-300 ${
          menuAbierto ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative ${colapsado ? "md:w-20" : "md:w-64"} w-64 p-4`}
      >
        <div>
          <div className="flex items-center justify-between mb-8 px-2 pt-2">
            {!colapsado && (
              <div>
                <Link href="/" className="text-xl font-bold tracking-tighter">
                  Tu<span className="text-[#ccff00]">Marketing</span>
                </Link>
                <span className="block text-[10px] text-neutral-500 font-bold tracking-widest uppercase mt-1">Portal Alumnos v1.0</span>
              </div>
            )}
            <button
              onClick={() => setColapsado(!colapsado)}
              className="hidden md:flex text-neutral-500 hover:text-white transition-colors p-1"
            >
              {colapsado ? "»" : "«"}
            </button>
            <button onClick={() => setMenuAbierto(false)} className="md:hidden text-neutral-500 hover:text-white p-1">✕</button>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => { setVista("inicio"); setMenuAbierto(false); }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${
                vista === "inicio" ? "bg-[#ccff00]/10 text-[#ccff00]" : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
              }`}
            >
              <span className="text-lg shrink-0">🏠</span>
              {!colapsado && <span className="font-medium text-sm">Inicio</span>}
            </button>

            {CURSOS_HABILITADO && (
              <button
                onClick={() => { setVista("certificados"); setMenuAbierto(false); }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${
                  vista === "certificados" ? "bg-[#ccff00]/10 text-[#ccff00]" : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                }`}
              >
                <span className="text-lg shrink-0">🎓</span>
                {!colapsado && <span className="font-medium text-sm">Certificados</span>}
              </button>
            )}

            {CURSOS_HABILITADO && (
              <Link
                href="/cursos"
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors text-neutral-400 hover:text-white hover:bg-neutral-800/50"
              >
                <span className="text-lg shrink-0">🛍️</span>
                {!colapsado && <span className="font-medium text-sm">Más Cursos</span>}
              </Link>
            )}

            <button
              onClick={() => { setVista("proyectos"); setMenuAbierto(false); }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${
                vista === "proyectos" ? "bg-[#ccff00]/10 text-[#ccff00]" : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
              }`}
            >
              <span className="text-lg shrink-0">🗂️</span>
              {!colapsado && <span className="font-medium text-sm">Mis Proyectos</span>}
            </button>

            {linkAsesoria && (
              <a
                href={linkAsesoria}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors text-neutral-400 hover:text-white hover:bg-neutral-800/50"
              >
                <span className="text-lg shrink-0">🗓️</span>
                {!colapsado && <span className="font-medium text-sm">Agendar Asesoría</span>}
              </a>
            )}

            <div className="border-t border-neutral-800 my-3" />

            {linkConsulta && (
              <a
                href={linkConsulta}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors text-neutral-400 hover:text-white hover:bg-neutral-800/50"
              >
                <span className="text-lg shrink-0">💬</span>
                {!colapsado && <span className="font-medium text-sm">Soporte</span>}
              </a>
            )}

            {config?.whatsapp_comunidad_url && (
              <a
                href={config.whatsapp_comunidad_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors text-neutral-400 hover:text-white hover:bg-neutral-800/50"
              >
                <span className="text-lg shrink-0">👥</span>
                {!colapsado && <span className="font-medium text-sm">Grupo WhatsApp</span>}
              </a>
            )}

            {config?.discord_url && (
              <a
                href={config.discord_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors text-neutral-400 hover:text-white hover:bg-neutral-800/50"
              >
                <span className="text-lg shrink-0">🎮</span>
                {!colapsado && <span className="font-medium text-sm">Discord</span>}
              </a>
            )}
          </nav>
        </div>

        <button
          onClick={handleCerrarSesion}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors text-neutral-500 hover:text-red-400 hover:bg-neutral-800/50"
        >
          <span className="text-lg shrink-0">🚪</span>
          {!colapsado && <span className="font-medium text-sm">Cerrar sesión</span>}
        </button>
      </aside>

      {/* CONTENIDO */}
      <div className="flex-grow flex flex-col min-w-0">
        <header className="flex items-center justify-between px-5 md:px-8 py-4 md:py-5 border-b border-neutral-900 sticky top-0 bg-neutral-950/95 backdrop-blur z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setMenuAbierto(true)} className="md:hidden text-white p-1 -ml-1">☰</button>
            <h1 className="text-xl md:text-2xl font-black">
              {vista === "inicio" ? "Inicio" : vista === "certificados" ? "Certificados" : "Mis Proyectos"}
            </h1>
          </div>

          <div className="relative group py-2">
            <button className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center text-xs font-bold text-[#ccff00] overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  iniciales(nombreMostrado)
                )}
              </span>
              <svg className="w-4 h-4 text-neutral-500 group-hover:rotate-180 transition-transform hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div className="absolute top-full right-0 mt-0 w-48 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col overflow-hidden z-10">
              <span className="px-4 py-3 text-xs text-neutral-500 truncate border-b border-neutral-800">{perfil.email}</span>
              <button onClick={handleCerrarSesion} className="px-4 py-3 text-left hover:bg-neutral-800 hover:text-red-400 transition-colors text-sm">
                Cerrar sesión
              </button>
            </div>
          </div>
        </header>

        <main className="flex-grow p-5 md:p-10">
          {vista === "inicio" && (
            <>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                <h2 className="text-2xl md:text-3xl font-black">
                  ¡Hola, <span className="text-[#ccff00]">{nombreMostrado}</span>!
                </h2>
                {CURSOS_HABILITADO && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">Mostrar Cursos</label>
                    <select
                      value={mostrarTipo}
                      onChange={(e) => setMostrarTipo(e.target.value as "cursando" | "finalizados")}
                      className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-[#ccff00] transition-colors text-sm font-bold"
                    >
                      <option value="cursando">Cursando ({activos.length})</option>
                      <option value="finalizados">Finalizados ({finalizados.length})</option>
                    </select>
                  </div>
                )}
              </div>

              {CURSOS_HABILITADO && (
                cargandoCursos ? (
                  <div className="text-center py-16 text-neutral-400">Cargando tus cursos...</div>
                ) : listaSegunTipo.length === 0 ? (
                  <div className="text-center py-16 bg-neutral-900/40 border border-neutral-800 rounded-3xl mb-12">
                    {mostrarTipo === "cursando" ? (
                      <>
                        <p className="text-neutral-400 text-lg mb-6">Todavía no estás cursando nada activamente.</p>
                        <Link href="/cursos" className="inline-flex items-center gap-2 bg-[#ccff00] text-black px-6 py-3 rounded-full font-bold hover:bg-[#b8e600] transition-colors">
                          Ver catálogo de cursos <span>→</span>
                        </Link>
                      </>
                    ) : (
                      <p className="text-neutral-400 text-lg">Todavía no completaste ningún curso. ¡Seguí aprendiendo!</p>
                    )}
                  </div>
                ) : (
                  <div className="relative mb-12">
                    <div className="bg-neutral-900/60 border-2 border-[#ccff00] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
                      {destacado && (
                        <>
                          <CircularProgress porcentaje={destacado.progreso} />

                          <div className="flex-grow min-w-0">
                            <h3 className="text-xl md:text-2xl font-black text-white mb-1 truncate">
                              {destacado.cursos?.titulo || "Curso eliminado"}
                            </h3>
                            <p className="text-neutral-500 text-sm">{destacado.cursos?.modalidad}</p>
                          </div>

                          <div className="flex items-center gap-4 bg-neutral-950/60 border border-neutral-800 rounded-2xl p-4 md:min-w-[320px]">
                            <span className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xl shrink-0">
                              {destacado.leccion_actual ? "▶️" : "🎉"}
                            </span>
                            <div className="min-w-0 flex-grow">
                              <p className="text-white font-bold text-sm leading-snug">
                                {destacado.leccion_actual ? "Seguí donde lo dejaste" : "¡Bienvenido/a a tu nuevo curso!"}
                              </p>
                              <p className="text-neutral-500 text-xs truncate">
                                {destacado.leccion_actual?.titulo || "Arrancá cuando quieras"}
                              </p>
                            </div>
                            {destacado.cursos && (
                              <Link
                                href={`/alumnos/cursos/${destacado.cursos.id}`}
                                className="shrink-0 bg-[#ccff00] text-black text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-[#b8e600] transition-colors whitespace-nowrap"
                              >
                                Ir al Curso
                              </Link>
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    {listaSegunTipo.length > 1 && (
                      <>
                        <button
                          onClick={() => avanzar(-1)}
                          aria-label="Curso anterior"
                          className="hidden md:flex absolute top-1/2 -translate-y-1/2 -left-5 w-10 h-10 rounded-full bg-neutral-900 border border-neutral-700 items-center justify-center text-white hover:border-[#ccff00] hover:text-[#ccff00] transition-colors shadow-xl"
                        >
                          ‹
                        </button>
                        <button
                          onClick={() => avanzar(1)}
                          aria-label="Siguiente curso"
                          className="hidden md:flex absolute top-1/2 -translate-y-1/2 -right-5 w-10 h-10 rounded-full bg-neutral-900 border border-neutral-700 items-center justify-center text-white hover:border-[#ccff00] hover:text-[#ccff00] transition-colors shadow-xl"
                        >
                          ›
                        </button>
                        <p className="text-center text-neutral-500 text-xs mt-3">
                          {indiceDestacado + 1} / {listaSegunTipo.length}
                        </p>
                      </>
                    )}
                  </div>
                )
              )}

              {/* Tus Servicios Activos: en Inicio, con cursos desactivados, es el contenido principal */}
              {serviciosActivos.length > 0 ? (
                <section className="mb-12">
                  <div className="mb-6">
                    <h2 className="text-xl font-black mb-1">Tus Servicios Activos</h2>
                    <p className="text-neutral-400 text-sm">El estado de los servicios que contrataste con la agencia.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {serviciosActivos.map((servicio) => (
                      <TarjetaServicio key={servicio.id} servicio={servicio} />
                    ))}
                  </div>
                </section>
              ) : (
                !CURSOS_HABILITADO && (
                  <div className="text-center py-16 bg-neutral-900/40 border border-neutral-800 rounded-3xl">
                    <p className="text-neutral-400 text-lg mb-6">Todavía no contrataste ningún servicio.</p>
                    <Link href="/servicios" className="inline-flex items-center gap-2 bg-[#ccff00] text-black px-6 py-3 rounded-full font-bold hover:bg-[#b8e600] transition-colors">
                      Ver nuestros servicios <span>→</span>
                    </Link>
                  </div>
                )
              )}

              {/* Teaser de más cursos */}
              {CURSOS_HABILITADO && (
                <section>
                  <h2 className="text-xl font-black mb-2">Seguí aprendiendo</h2>
                  <p className="text-neutral-400 text-sm mb-6 max-w-2xl">
                    Explorá el catálogo completo y sumá nuevas habilidades a tu perfil profesional.
                  </p>
                  <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-3xl p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                      <p className="font-bold text-white text-lg mb-1">¿Qué querés aprender ahora?</p>
                      <p className="text-neutral-500 text-sm">Descubrí todos nuestros cursos disponibles.</p>
                    </div>
                    <Link href="/cursos" className="shrink-0 inline-flex items-center gap-2 bg-[#ccff00] text-black px-6 py-3 rounded-full font-bold hover:bg-[#b8e600] transition-colors w-fit">
                      Ver catálogo <span>→</span>
                    </Link>
                  </div>
                </section>
              )}
            </>
          )}

          {vista === "certificados" && (
            <div>
              <h2 className="text-2xl font-black mb-2">🎓 Tus Certificados</h2>
              <p className="text-neutral-400 text-sm mb-8">Descargá el diploma de cada curso que ya completaste.</p>

              {finalizados.length === 0 ? (
                <div className="text-center py-16 bg-neutral-900/40 border border-neutral-800 rounded-3xl">
                  <p className="text-neutral-400 text-lg">Todavía no tenés certificados. ¡Completá un curso para desbloquear el primero!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {finalizados.map((insc) => (
                    <div key={insc.id} className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6 flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">🏆</span>
                        <div className="min-w-0">
                          <p className="font-bold text-white text-sm truncate">{insc.cursos?.titulo || "Curso eliminado"}</p>
                          <p className="text-neutral-500 text-xs">Curso completado</p>
                        </div>
                      </div>
                      <button
                        onClick={() => insc.cursos && generarDiplomaPDF({ nombreAlumno: nombreMostrado, tituloCurso: insc.cursos.titulo })}
                        disabled={!insc.cursos}
                        className="w-full bg-[#ccff00] text-black text-sm font-bold px-4 py-3 rounded-xl hover:bg-[#b8e600] transition-colors disabled:opacity-40"
                      >
                        ⬇️ Descargar Diploma
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {vista === "proyectos" && (
            <div>
              <h2 className="text-2xl font-black mb-2">🗂️ Mis Proyectos</h2>
              <p className="text-neutral-400 text-sm mb-8">
                Seguimiento de los servicios que contrataste con nuestra agencia.
              </p>

              {serviciosActivos.length === 0 ? (
                <div className="text-center py-16 bg-neutral-900/40 border border-neutral-800 rounded-3xl">
                  <p className="text-neutral-400 text-lg mb-6">Todavía no contrataste ningún servicio.</p>
                  <Link
                    href="/servicios"
                    className="inline-flex items-center gap-2 bg-[#ccff00] text-black px-6 py-3 rounded-full font-bold hover:bg-[#b8e600] transition-colors"
                  >
                    Ver nuestros servicios <span>→</span>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {serviciosActivos.map((servicio) => (
                    <TarjetaServicio key={servicio.id} servicio={servicio} />
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
