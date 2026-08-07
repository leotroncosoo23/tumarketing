import { NextRequest, NextResponse } from "next/server";
import { notificarSuscriptores, obtenerUrlBase } from "@/lib/notificar-suscriptores";

export async function POST(request: NextRequest) {
  try {
    const { titulo, descripcion, imagen_url, slug } = await request.json();
    const urlBase = obtenerUrlBase();
    const urlArticulo = slug ? `${urlBase}/blog/${slug}` : `${urlBase}/blog`;

    const resultado = await notificarSuscriptores({
      encabezado: "📝 ¡Nuevo Artículo en el Blog!",
      asunto: `📝 Nuevo Artículo: ${titulo}`,
      titulo,
      descripcion,
      imagenUrl: imagen_url,
      urlDestino: urlArticulo,
      textoBoton: "Leer Artículo Completo",
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
