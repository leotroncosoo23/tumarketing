import { ImageResponse } from "next/og";

export const alt = "TuMarketing — Agencia de marketing digital";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Tarjeta que se ve al compartir el sitio en redes y WhatsApp.
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 80,
        color: "white",
        background: "radial-gradient(900px 500px at 50% -10%, rgba(204,255,0,0.28), transparent 70%), #000",
      }}
    >
      <div style={{ display: "flex", fontSize: 44, fontWeight: 700 }}>
        Tu<span style={{ color: "#ccff00" }}>Marketing</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", marginTop: 36, fontSize: 84, fontWeight: 800, lineHeight: 1.05 }}>
        <span>Hacemos que tu marca</span>
        <span style={{ color: "#ccff00" }}>se vea, se escuche y venda.</span>
      </div>
      <div style={{ display: "flex", marginTop: 44, fontSize: 34, color: "#a3a3a3" }}>+15 marcas · +50M de views · +50K seguidores orgánicos</div>
    </div>,
    size,
  );
}
