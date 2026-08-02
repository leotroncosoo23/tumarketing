"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Copy } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ESTADOS_SERVICIO_CONTRATADO, ETIQUETA_ESTADO } from "@/lib/estado-servicio";
import GestionModuloPanel from "@/components/dashboard/GestionModuloPanel";
import { Card, Button, Input, Select, Badge } from "@/components/dashboard/ui";
import type { ClienteResumen } from "@/lib/dashboard-queries";
import type { SectionId } from "@/components/dashboard/AdminShell";

type Recurso = { id: string; titulo: string };
type ServicioCatalogo = { id: string; titulo: string };

type AccesoRecurso = {
  id: string;
  usuario_id: string;
  recurso_id: string;
  recursos?: { titulo: string } | null;
};

type ServicioContratadoDetalle = {
  id: string;
  usuario_id: string;
  servicio_id: string;
  estado: string;
  suspendido: boolean;
  progreso?: number | null;
  servicios?: { titulo: string; modulo: string } | null;
};

function money(n: number) {
  return "$" + n.toLocaleString("es-AR");
}

export default function ClientesSection({
  initial,
  onSelectSection,
}: {
  initial: ClienteResumen[];
  onSelectSection: (id: SectionId) => void;
}) {
  const [clientes, setClientes] = useState<ClienteResumen[]>(initial);
  const [busqueda, setBusqueda] = useState("");
  const [seleccionadoId, setSeleccionadoId] = useState<string | null>(initial[0]?.id ?? null);

  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [servicios, setServicios] = useState<ServicioCatalogo[]>([]);
  const [accesosRecursos, setAccesosRecursos] = useState<AccesoRecurso[]>([]);
  const [serviciosContratados, setServiciosContratados] = useState<ServicioContratadoDetalle[]>([]);
  const [proximaEntrega, setProximaEntrega] = useState<string | null>(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [recursoParaOtorgar, setRecursoParaOtorgar] = useState("");
  const [servicioParaOtorgar, setServicioParaOtorgar] = useState("");
  const [gestionandoServicioId, setGestionandoServicioId] = useState<string | null>(null);

  const [mostrarNuevo, setMostrarNuevo] = useState(false);
  const [nombreNuevo, setNombreNuevo] = useState("");
  const [emailNuevo, setEmailNuevo] = useState("");
  const [creando, setCreando] = useState(false);
  const [passwordGenerada, setPasswordGenerada] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("recursos").select("id, titulo").then(({ data }) => setRecursos(data || []));
    supabase.from("servicios").select("id, titulo").then(({ data }) => setServicios(data || []));
  }, []);

  const cargarDetalle = async (usuarioId: string) => {
    setCargandoDetalle(true);
    const [{ data: accesos }, { data: contratados }] = await Promise.all([
      supabase.from("accesos_recursos").select("*, recursos(titulo)").eq("usuario_id", usuarioId),
      supabase
        .from("servicios_contratados")
        .select("*, servicios(titulo, modulo)")
        .eq("usuario_id", usuarioId),
    ]);
    const listaContratados = (contratados as unknown as ServicioContratadoDetalle[]) || [];
    setAccesosRecursos((accesos as AccesoRecurso[]) || []);
    setServiciosContratados(listaContratados);

    const servicioActivo = listaContratados.find((sc) => !sc.suspendido);
    if (servicioActivo) {
      const { data: proximoEvento } = await supabase
        .from("posts_calendario")
        .select("fecha_publicacion")
        .eq("servicio_contratado_id", servicioActivo.id)
        .gte("fecha_publicacion", new Date().toISOString())
        .order("fecha_publicacion", { ascending: true })
        .limit(1)
        .maybeSingle();
      setProximaEntrega(proximoEvento?.fecha_publicacion ?? null);
    } else {
      setProximaEntrega(null);
    }
    setCargandoDetalle(false);
  };

  useEffect(() => {
    if (seleccionadoId) cargarDetalle(seleccionadoId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seleccionadoId]);

  const filtrados = useMemo(
    () =>
      clientes.filter((c) => (c.nombre || c.email).toLowerCase().includes(busqueda.toLowerCase())),
    [clientes, busqueda]
  );

  const seleccionado = clientes.find((c) => c.id === seleccionadoId) || null;

  const actualizarEstadoServicio = async (servicioContratadoId: string, estado: string) => {
    const { error } = await supabase.from("servicios_contratados").update({ estado }).eq("id", servicioContratadoId);
    if (error) return alert("Error al actualizar el estado: " + error.message);
    setServiciosContratados((prev) => prev.map((s) => (s.id === servicioContratadoId ? { ...s, estado } : s)));
  };

  const togglearSuspension = async (servicioContratadoId: string, suspender: boolean) => {
    const confirmacion = suspender
      ? "¿Suspender el acceso a este proyecto?"
      : "¿Reactivar el acceso a este proyecto?";
    if (!confirm(confirmacion)) return;
    const { error } = await supabase.from("servicios_contratados").update({ suspendido: suspender }).eq("id", servicioContratadoId);
    if (error) return alert("Error al actualizar el acceso: " + error.message);
    setServiciosContratados((prev) => prev.map((s) => (s.id === servicioContratadoId ? { ...s, suspendido: suspender } : s)));
  };

  const otorgarRecurso = async () => {
    if (!recursoParaOtorgar || !seleccionado) return;
    const { data, error } = await supabase
      .from("accesos_recursos")
      .insert([{ usuario_id: seleccionado.id, recurso_id: recursoParaOtorgar }])
      .select("*, recursos(titulo)")
      .single();
    if (error) return alert("Error al otorgar el recurso: " + error.message);
    setAccesosRecursos((prev) => [...prev, data as AccesoRecurso]);
    setRecursoParaOtorgar("");
  };

  const otorgarServicio = async () => {
    if (!servicioParaOtorgar || !seleccionado) return;
    const { error } = await supabase
      .from("servicios_contratados")
      .insert([{ usuario_id: seleccionado.id, servicio_id: servicioParaOtorgar, estado: ESTADOS_SERVICIO_CONTRATADO[0] }]);
    if (error) return alert("Error al asignar el servicio: " + error.message);
    await cargarDetalle(seleccionado.id);
    setServicioParaOtorgar("");
  };

  const generarPasswordTemporal = () => Math.random().toString(36).slice(-6) + Math.floor(Math.random() * 90 + 10);

  const crearCliente = async () => {
    if (!nombreNuevo.trim() || !emailNuevo.trim()) return;
    setCreando(true);
    const password = generarPasswordTemporal();
    try {
      const res = await fetch("/api/crear-usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailNuevo.trim(), nombre: nombreNuevo.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert("Error: " + data.error);
        setCreando(false);
        return;
      }
      setClientes((prev) => [
        {
          id: data.usuarioId,
          nombre: nombreNuevo.trim(),
          email: emailNuevo.trim(),
          activo: true,
          estadoCuenta: "activo",
          creadoEn: new Date().toISOString(),
          plan: null,
          mrr: 0,
          proyectos: [],
        },
        ...prev,
      ]);
      setPasswordGenerada(password);
      setSeleccionadoId(data.usuarioId);
      setNombreNuevo("");
      setEmailNuevo("");
    } catch (err) {
      alert("Error de conexión: " + (err instanceof Error ? err.message : "desconocido"));
    }
    setCreando(false);
  };

  const recursosDisponibles = recursos.filter((r) => !accesosRecursos.some((a) => a.recurso_id === r.id));
  const serviciosDisponibles = servicios.filter((s) => !serviciosContratados.some((sc) => sc.servicio_id === s.id));
  const servicioActivo = serviciosContratados.find((sc) => !sc.suspendido);

  return (
    <div className="flex flex-col gap-[var(--space-6)]">
      <div>
        <h1 className="tm-display [font-size:1.9rem] font-bold tracking-[var(--ls-tight)] text-[var(--text-primary)]">
          Clientes
        </h1>
        <p className="text-[var(--text-secondary)] [font-size:var(--fs-body-m)]">
          Gestioná el estado y la relación con cada cuenta.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-[var(--space-5)] lg:grid-cols-[1fr_1.3fr] lg:items-start">
      <div>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar cliente..."
              className="w-full rounded-[var(--radius-m)] border border-[var(--border-subtle)] bg-[var(--surface-sunken)] py-2.5 pl-9 pr-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--border-focus)]"
            />
          </div>
          <Button
            onClick={() => {
              setMostrarNuevo((v) => !v);
              setPasswordGenerada(null);
            }}
            className="shrink-0 !text-[var(--black-1)]"
          >
            + Nuevo cliente
          </Button>
        </div>

        {mostrarNuevo && (
          <Card className="mb-4 flex flex-col gap-3">
            {passwordGenerada ? (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-[var(--text-tertiary)]">
                  Contraseña temporal (pasásela al cliente, no se vuelve a mostrar):
                </p>
                <div className="flex items-center gap-2 rounded-[var(--radius-m)] border border-[var(--accent)]/30 bg-[var(--surface-sunken)] px-3 py-2">
                  <code className="flex-1 text-sm font-bold text-[var(--accent)]">{passwordGenerada}</code>
                  <button onClick={() => navigator.clipboard.writeText(passwordGenerada)}>
                    <Copy className="h-3.5 w-3.5 text-[var(--text-tertiary)]" />
                  </button>
                </div>
                <Button variant="ghost" onClick={() => setMostrarNuevo(false)}>
                  Listo
                </Button>
              </div>
            ) : (
              <>
                <Input value={nombreNuevo} onChange={(e) => setNombreNuevo(e.target.value)} placeholder="Nombre" />
                <Input type="email" value={emailNuevo} onChange={(e) => setEmailNuevo(e.target.value)} placeholder="Email" />
                <Button onClick={crearCliente} disabled={creando || !nombreNuevo.trim() || !emailNuevo.trim()}>
                  {creando ? "Creando..." : "Crear cliente"}
                </Button>
              </>
            )}
          </Card>
        )}

        <div className="flex flex-col gap-2">
          {filtrados.map((c) => (
            <button
              key={c.id}
              onClick={() => setSeleccionadoId(c.id)}
              className={`flex items-center gap-[14px] rounded-[var(--radius-m)] border p-[14px] text-left transition-colors ${
                seleccionadoId === c.id
                  ? "border-[var(--border-strong)] bg-[var(--surface-card)]"
                  : "border-transparent hover:bg-[var(--surface-card)]"
              }`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--black-4)] font-bold text-[var(--accent)]">
                {(c.nombre || c.email).slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-[var(--text-primary)] [font-size:var(--fs-body-s)]">
                  {c.nombre || c.email}
                </p>
                <p className="truncate text-[var(--text-tertiary)] [font-size:12px]">
                  {c.plan || "Sin plan"} · {c.mrr > 0 ? money(c.mrr) + "/mes" : "—"}
                </p>
              </div>
              <Badge tone={!c.activo ? "red" : undefined}>{!c.activo ? "Revocado" : c.estadoCuenta}</Badge>
            </button>
          ))}
          {filtrados.length === 0 && (
            <p className="p-4 text-center text-sm text-[var(--text-tertiary)]">Ningún cliente coincide.</p>
          )}
        </div>
      </div>

      <Card>
        {!seleccionado ? (
          <p className="py-10 text-center text-[var(--text-tertiary)]">Elegí un cliente de la lista.</p>
        ) : (
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--black-4)] text-lg font-bold text-[var(--accent)]">
                  {(seleccionado.nombre || seleccionado.email).slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <p className="tm-display text-lg font-bold text-[var(--text-primary)]">
                    {seleccionado.nombre || "Sin nombre"}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">{seleccionado.email}</p>
                </div>
              </div>
              <Badge tone={!seleccionado.activo ? "red" : undefined}>
                {!seleccionado.activo ? "Revocado" : seleccionado.estadoCuenta}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-4 border-y border-[var(--border-subtle)] py-4">
              <div>
                <p className="uppercase text-[var(--text-tertiary)] [font-size:11px] tracking-[var(--ls-eyebrow)]">Plan</p>
                <p className="font-semibold text-[var(--text-primary)]">{seleccionado.plan || "—"}</p>
              </div>
              <div>
                <p className="uppercase text-[var(--text-tertiary)] [font-size:11px] tracking-[var(--ls-eyebrow)]">MRR</p>
                <p className="font-semibold text-[var(--text-primary)]">{money(seleccionado.mrr)}</p>
              </div>
              <div>
                <p className="uppercase text-[var(--text-tertiary)] [font-size:11px] tracking-[var(--ls-eyebrow)]">Cliente desde</p>
                <p className="font-semibold text-[var(--text-primary)]">
                  {new Date(seleccionado.creadoEn).toLocaleDateString("es-AR")}
                </p>
              </div>
            </div>

            {(() => {
              const progreso = servicioActivo?.progreso ?? 50;
              return (
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[var(--text-secondary)] [font-size:13px]">Progreso del servicio activo</span>
                    <span className="font-bold text-[var(--accent)] [font-size:13px]">{progreso}%</span>
                  </div>
                  <div className="h-[8px] overflow-hidden rounded-[var(--radius-pill)] bg-[var(--black-4)]">
                    <div className="h-full bg-[var(--accent)]" style={{ width: `${progreso}%` }} />
                  </div>
                  <p className="mt-[6px] text-[var(--text-tertiary)] [font-size:12px]">
                    Próxima entrega:{" "}
                    {proximaEntrega ? new Date(proximaEntrega).toLocaleDateString("es-AR") : "Sin fecha programada"}
                  </p>
                  <div className="mt-4 flex gap-3">
                    <Button onClick={() => onSelectSection("proyectos")}>Ver proyecto</Button>
                    <Button variant="secondary" onClick={() => onSelectSection("mensajes")}>
                      Enviar mensaje
                    </Button>
                  </div>
                </div>
              );
            })()}

            {cargandoDetalle ? (
              <p className="text-center text-[var(--text-tertiary)]">Cargando...</p>
            ) : (
              <>
                <div>
                  <h4 className="mb-2 text-xs font-bold uppercase text-[var(--text-tertiary)]">Guías y recursos</h4>
                  {accesosRecursos.length === 0 ? (
                    <p className="text-sm text-[var(--text-tertiary)]">Sin recursos otorgados.</p>
                  ) : (
                    <ul className="mb-2 flex flex-col gap-1.5">
                      {accesosRecursos.map((a) => (
                        <li key={a.id} className="rounded-[var(--radius-m)] bg-[var(--surface-sunken)] px-3 py-2 text-sm text-[var(--text-primary)]">
                          {a.recursos?.titulo || "Recurso eliminado"}
                        </li>
                      ))}
                    </ul>
                  )}
                  {recursosDisponibles.length > 0 && (
                    <div className="flex gap-2">
                      <Select value={recursoParaOtorgar} onChange={(e) => setRecursoParaOtorgar(e.target.value)} className="flex-1">
                        <option value="">Otorgar recurso...</option>
                        {recursosDisponibles.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.titulo}
                          </option>
                        ))}
                      </Select>
                      <Button variant="secondary" onClick={otorgarRecurso} disabled={!recursoParaOtorgar}>
                        Otorgar
                      </Button>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="mb-2 text-xs font-bold uppercase text-[var(--text-tertiary)]">Servicios contratados</h4>
                  <div className="flex flex-col gap-2">
                    {serviciosContratados.map((sc) => (
                      <div key={sc.id} className="rounded-[var(--radius-m)] border border-[var(--border-subtle)] p-3">
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-[var(--text-primary)]">
                            {sc.servicios?.titulo || "Servicio eliminado"}
                          </span>
                          {sc.suspendido && <Badge tone="red">Suspendido</Badge>}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Select
                            value={sc.estado}
                            onChange={(e) => actualizarEstadoServicio(sc.id, e.target.value)}
                            className="w-auto text-xs"
                          >
                            {ESTADOS_SERVICIO_CONTRATADO.map((estado) => (
                              <option key={estado} value={estado}>
                                {ETIQUETA_ESTADO[estado]}
                              </option>
                            ))}
                          </Select>
                          <Button variant="secondary" onClick={() => setGestionandoServicioId(sc.id)} className="text-xs">
                            Gestionar módulo
                          </Button>
                          <Button
                            variant={sc.suspendido ? "secondary" : "danger"}
                            onClick={() => togglearSuspension(sc.id, !sc.suspendido)}
                            className="text-xs"
                          >
                            {sc.suspendido ? "Reactivar" : "Suspender"}
                          </Button>
                        </div>
                      </div>
                    ))}
                    {serviciosContratados.length === 0 && (
                      <p className="text-sm text-[var(--text-tertiary)]">Sin servicios contratados todavía.</p>
                    )}
                  </div>
                  {serviciosDisponibles.length > 0 && (
                    <div className="mt-2 flex gap-2">
                      <Select value={servicioParaOtorgar} onChange={(e) => setServicioParaOtorgar(e.target.value)} className="flex-1">
                        <option value="">Asignar servicio...</option>
                        {serviciosDisponibles.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.titulo}
                          </option>
                        ))}
                      </Select>
                      <Button variant="secondary" onClick={otorgarServicio} disabled={!servicioParaOtorgar}>
                        Asignar
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </Card>

      {gestionandoServicioId &&
        (() => {
          const sc = serviciosContratados.find((s) => s.id === gestionandoServicioId);
          if (!sc) return null;
          return (
            <GestionModuloPanel
              servicioContratadoId={sc.id}
              usuarioId={sc.usuario_id}
              nombreServicio={sc.servicios?.titulo || "Servicio"}
              modulo={sc.servicios?.modulo || "otro"}
              onCerrar={() => setGestionandoServicioId(null)}
            />
          );
        })()}
      </div>
    </div>
  );
}
