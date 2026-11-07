"use client";

import { useEffect, useState } from "react";
import { Card, Button, Badge } from "@/components/dashboard/ui";
import {
  obtenerEstadoMercadoPago,
  generarLinkConexionMercadoPago,
  desconectarMercadoPago,
} from "@/app/actions/mercadopago-conexion";

type Estado = Extract<Awaited<ReturnType<typeof obtenerEstadoMercadoPago>>, { ok: true }>["data"];

function fecha(iso: string | null) {
  return iso ? new Date(iso).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" }) : "—";
}

// Conexión OAuth con la cuenta de Mercado Pago que cobra. El admin genera un
// link, se lo manda a la dueña de la cuenta y ella autoriza una sola vez.
export default function MercadoPagoConexion() {
  const [estado, setEstado] = useState<Estado | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [link, setLink] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [trabajando, setTrabajando] = useState(false);

  const cargar = () =>
    obtenerEstadoMercadoPago().then((res) => {
      if (res.ok) setEstado(res.data);
      else setError(res.error);
    });

  useEffect(() => {
    obtenerEstadoMercadoPago().then((res) => {
      if (res.ok) setEstado(res.data);
      else setError(res.error);
    });
  }, []);

  const generarLink = async () => {
    setTrabajando(true);
    setCopiado(false);
    const res = await generarLinkConexionMercadoPago();
    if (res.ok) setLink(res.data);
    else alert(res.error);
    setTrabajando(false);
  };

  const copiar = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopiado(true);
    } catch {
      alert("No se pudo copiar automáticamente. Seleccioná el link y copialo a mano.");
    }
  };

  const desconectar = async () => {
    if (!confirm("¿Desconectar la cuenta de Mercado Pago? El sitio deja de poder cobrar hasta que se vuelva a conectar.")) return;
    setTrabajando(true);
    const res = await desconectarMercadoPago();
    if (!res.ok) alert(res.error);
    setLink(null);
    await cargar();
    setTrabajando(false);
  };

  if (error) return <p className="text-sm text-[var(--signal-error)]">{error}</p>;
  if (!estado) return <p className="text-center text-[var(--text-tertiary)]">Cargando...</p>;

  return (
    <div className="flex max-w-xl flex-col gap-5">
      <Card className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-bold text-[var(--text-primary)]">Mercado Pago</h3>
          {estado.conectada ? <Badge tone="lime">Conectado</Badge> : <Badge tone="red">Sin conectar</Badge>}
        </div>

        {estado.conectada ? (
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
            <dt className="text-[var(--text-tertiary)]">Cuenta</dt>
            <dd className="text-[var(--text-primary)]">{estado.cuenta || `ID ${estado.mpUserId}`}</dd>
            <dt className="text-[var(--text-tertiary)]">Conectada el</dt>
            <dd className="text-[var(--text-primary)]">{fecha(estado.conectadoEn)}</dd>
            <dt className="text-[var(--text-tertiary)]">Token vence</dt>
            <dd className="text-[var(--text-primary)]">{fecha(estado.expiraEn)} (se renueva solo)</dd>
          </dl>
        ) : (
          <p className="text-sm text-[var(--text-secondary)]">
            Generá el link y mandáselo a quien cobra. Lo abre, inicia sesión en su Mercado Pago y autoriza: desde ahí los
            pagos del sitio entran directo en su cuenta.
          </p>
        )}

        {estado.usaTokenFijo && (
          <p className="rounded-[var(--radius-m)] border border-[var(--border-subtle)] p-3 text-xs text-[var(--text-secondary)]">
            Ojo: <code>MP_ACCESS_TOKEN</code> está definido en este servidor, así que los cobros usan ese token y no la cuenta
            conectada. En local está bien (credenciales de prueba); en producción borralo de Vercel.
          </p>
        )}

        {!estado.appConfigurada ? (
          <p className="text-sm text-[var(--signal-error)]">
            Faltan <code>MP_CLIENT_ID</code> y <code>MP_CLIENT_SECRET</code> en las variables del servidor.
          </p>
        ) : (
          <div className="flex flex-wrap gap-3 border-t border-[var(--border-subtle)] pt-4">
            <Button onClick={generarLink} disabled={trabajando}>
              {estado.conectada ? "Generar link para reconectar" : "Generar link de conexión"}
            </Button>
            {estado.conectada && (
              <Button variant="danger" onClick={desconectar} disabled={trabajando}>
                Desconectar
              </Button>
            )}
          </div>
        )}

        {link && (
          <div className="flex flex-col gap-2">
            <textarea
              readOnly
              value={link}
              rows={3}
              onFocus={(e) => e.currentTarget.select()}
              className="w-full resize-none rounded-[var(--radius-m)] border border-[var(--border-subtle)] bg-[var(--surface-card)] p-3 text-xs text-[var(--text-secondary)]"
            />
            <div className="flex items-center gap-3">
              <Button variant="secondary" onClick={copiar}>
                {copiado ? "¡Copiado!" : "Copiar link"}
              </Button>
              <span className="text-xs text-[var(--text-tertiary)]">Vale por 48 horas.</span>
            </div>
          </div>
        )}
      </Card>

      <Card>
        <h3 className="mb-2 font-bold text-[var(--text-primary)]">URL de redirección</h3>
        <p className="mb-2 text-sm text-[var(--text-secondary)]">
          Tiene que estar cargada tal cual en tu aplicación de Mercado Pago Developers:
        </p>
        <code className="block break-all rounded-[var(--radius-m)] bg-[var(--black-4)] p-3 text-xs text-[var(--accent)]">
          {estado.urlCallback}
        </code>
      </Card>
    </div>
  );
}
