import { NextRequest, NextResponse } from "next/server";
import { notificarSuscriptores, obtenerUrlBase } from "@/lib/notificar-suscriptores";

export async function POST(request: NextRequest) {
  try {
    const { titulo, descripcion, imagen_url, id, esNuevo } = await request.json();
    const urlBase = obtenerUrlBase();
    const urlServicio = id ? `${urlBase}/servicios/${id}` : `${urlBase}/servicios`;

    const resultado = await notificarSuscriptores({
      encabezado: esNuevo ? "🚀 ¡Nuevo Servicio Disponible!" : "✨ ¡Actualizamos uno de nuestros servicios!",
      asunto: esNuevo ? `🚀 Nuevo servicio: ${titulo}` : `✨ Novedades en: ${titulo}`,
      titulo,
      descripcion,
      imagenUrl: imagen_url,
      urlDestino: urlServicio,
      textoBoton: "Ver Servicio",
    });

    if (!resultado.ok) {
      return NextResponse.json({ error: resultado.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Notificación enviada a ${resultado.enviados} de ${resultado.total} suscriptores`,
      suscriptoresCount: resultado.enviados,
      errores: resultado.errores,
    });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: "Error al enviar notificación", details: mensaje }, { status: 500 });
  }
}
