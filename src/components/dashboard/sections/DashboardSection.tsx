import { Card, Badge } from "@/components/dashboard/ui";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import type { InitialAdminData, SectionId } from "@/components/dashboard/AdminShell";

const MES_ABREV = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

function fechaCorta(iso: string) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")} ${MES_ABREV[d.getMonth()]}`;
}

function tiempoRelativo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "Recién";
  if (min < 60) return `Hace ${min} min`;
  const horas = Math.floor(min / 60);
  if (horas < 24) return `Hace ${horas} hora${horas === 1 ? "" : "s"}`;
  const dias = Math.floor(horas / 24);
  if (dias === 1) return "Ayer";
  if (dias < 7) return `Hace ${dias} días`;
  return new Date(iso).toLocaleDateString("es-AR");
}

type ActividadItem = { texto: string; fecha: string };

function actividadReciente(initial: InitialAdminData): ActividadItem[] {
  const items: ActividadItem[] = [];

  initial.proyectos.forEach((p) => {
    if (p.otorgadoEn) items.push({ texto: `${p.clienteNombre} contrató ${p.servicioTitulo}`, fecha: p.otorgadoEn });
  });
  initial.blogs
    .filter((b) => b.estado === "Publicado")
    .forEach((b) => items.push({ texto: `Se publicó el post "${b.titulo}"`, fecha: b.creado_en }));
  initial.conversaciones.forEach((c) => {
    if (c.ultimaFecha) items.push({ texto: `${c.clienteNombre} envió un mensaje en ${c.servicioTitulo}`, fecha: c.ultimaFecha });
  });

  return items.sort((a, b) => (b.fecha > a.fecha ? 1 : -1)).slice(0, 4);
}

export default function DashboardSection({
  initial,
  onSelectSection,
}: {
  initial: InitialAdminData;
  onSelectSection: (id: SectionId) => void;
}) {
  const proyectosEnCurso = initial.proyectos.filter((p) => !p.suspendido);
  const clienteEnRiesgo = initial.clientes.find((c) => c.estadoCuenta === "riesgo");
  const actividad = actividadReciente(initial);

  const topPosts = [...initial.blogs]
    .sort((a, b) => (b.vistas ?? 0) - (a.vistas ?? 0))
    .slice(0, 4);

  return (
    <div className="flex flex-col gap-[var(--space-6)]">
      <div>
        <h1 className="tm-display text-[1.9rem] font-bold text-[var(--text-primary)]">Panel de Agencia</h1>
        <p className="text-[var(--text-secondary)]">Resumen general de Tu Marketing.</p>
      </div>

      <DashboardStats initial={initial} />

      {clienteEnRiesgo && (
        <Card className="flex flex-wrap items-center justify-between gap-3 !border-[var(--signal-error)]">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--signal-error)]" />
            <span className="text-[var(--text-primary)]">
              <strong>{clienteEnRiesgo.nombre || clienteEnRiesgo.email}</strong> está marcado como cuenta en riesgo.
            </span>
          </div>
          <Badge tone="red">Riesgo</Badge>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-[var(--space-5)] lg:grid-cols-[1.4fr_1fr]">
        <Card padded={false}>
          <div className="flex items-center justify-between px-[var(--space-5)] pt-[var(--space-5)] pb-[var(--space-2)]">
            <h3 className="text-[var(--fs-heading-s)] font-bold text-[var(--text-primary)]">Proyectos en curso</h3>
            <button
              type="button"
              onClick={() => onSelectSection("proyectos")}
              className="cursor-pointer font-semibold text-[var(--accent)] [font-size:13px]"
            >
              Ver todos →
            </button>
          </div>
          <div>
            {proyectosEnCurso.length === 0 && (
              <p className="px-[var(--space-5)] pb-[var(--space-5)] [font-size:var(--fs-body-s)] text-[var(--text-tertiary)]">
                Todavía no hay proyectos activos.
              </p>
            )}
            {proyectosEnCurso.slice(0, 6).map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-[var(--space-4)] border-t border-[var(--border-subtle)] px-[var(--space-5)] py-[14px]"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-[var(--text-primary)] [font-size:var(--fs-body-s)]">
                    {p.clienteNombre}
                  </p>
                  <p className="truncate text-[var(--text-tertiary)] [font-size:12px]">
                    {p.servicioTitulo} • {p.estado}
                  </p>
                </div>
                <div className="h-[6px] w-[110px] shrink-0 overflow-hidden rounded-[var(--radius-pill)] bg-[var(--black-4)]">
                  <div className="h-full bg-[var(--accent)]" style={{ width: `${p.progreso}%` }} />
                </div>
                <span className="w-[60px] shrink-0 text-right text-[var(--text-secondary)] [font-size:12px]">
                  {p.otorgadoEn ? fechaCorta(p.otorgadoEn) : "—"}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex flex-col gap-[var(--space-5)]">
          <Card>
            <h3 className="mb-3 text-[var(--fs-heading-s)] font-bold text-[var(--text-primary)]">Actividad reciente</h3>
            {actividad.length === 0 && <p className="text-sm text-[var(--text-tertiary)]">Todavía no hay actividad.</p>}
            {actividad.map((a, i) => (
              <div key={i} className="mb-3 flex flex-col">
                <span className="text-sm text-[var(--text-primary)]">{a.texto}</span>
                <span className="text-xs text-[var(--text-tertiary)]">{tiempoRelativo(a.fecha)}</span>
              </div>
            ))}
          </Card>

          <Card>
            <h3 className="mb-3 text-[var(--fs-heading-s)] font-bold text-[var(--text-primary)]">Top posts del mes</h3>
            {topPosts.length === 0 && <p className="text-sm text-[var(--text-tertiary)]">Todavía no hay posts.</p>}
            {topPosts.map((post) => (
              <div key={post.id} className="mb-2 flex items-center justify-between gap-3">
                <span className="truncate text-sm text-[var(--text-secondary)]">{post.titulo}</span>
                <span className="shrink-0 text-sm font-bold text-[var(--accent)]">{post.vistas ?? 0}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
