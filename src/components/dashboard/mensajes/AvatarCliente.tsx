import { colorAvatar, iniciales } from "./utils";

export function AvatarCliente({ nombre, tamano = 44 }: { nombre: string; tamano?: number }) {
  return (
    <span
      aria-hidden
      className="tm-display flex shrink-0 items-center justify-center rounded-full font-bold"
      style={{ ...colorAvatar(nombre), width: tamano, height: tamano, fontSize: Math.round(tamano * 0.36) }}
    >
      {iniciales(nombre)}
    </span>
  );
}
