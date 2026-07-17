import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { titulo, descripcion, precio, descuento } = await request.json();

    // Obtener todos los suscriptores activos
    const { data: suscriptores, error: errorSuscriptores } = await supabase
      .from('suscriptores')
      .select('email')
      .eq('activo', true);

    if (errorSuscriptores) {
      return NextResponse.json(
        { error: 'Error al obtener suscriptores', details: errorSuscriptores },
        { status: 500 }
      );
    }

    if (!suscriptores || suscriptores.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No hay suscriptores para notificar',
        suscriptoresCount: 0
      });
    }

    // Preparar el contenido del email
    const precioConDescuento = descuento 
      ? Math.round(precio * (1 - descuento / 100))
      : precio;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ccff00 0%, #b8e600 100%); padding: 20px; border-radius: 10px; text-align: center;">
          <h1 style="color: black; margin: 0;">🎓 ¡Nuevo Curso Disponible!</h1>
        </div>
        
        <div style="background: #f5f5f5; padding: 30px; border-radius: 10px; margin-top: 20px;">
          <h2 style="color: #333; font-size: 24px;">${titulo}</h2>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            ${descripcion}
          </p>
          
          <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ccff00;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <p style="color: #999; margin: 0; font-size: 12px;">PRECIO</p>
                <p style="color: #333; margin: 5px 0 0 0; font-size: 20px; font-weight: bold;">
                  $${precioConDescuento.toLocaleString('es-AR')}
                </p>
              </div>
              ${descuento ? `
                <div style="text-align: right;">
                  <p style="color: #999; margin: 0; font-size: 12px;">PRECIO ORIGINAL</p>
                  <p style="color: #999; margin: 5px 0 0 0; font-size: 16px; text-decoration: line-through;">
                    $${precio.toLocaleString('es-AR')}
                  </p>
                  <p style="background: #ccff00; color: black; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 12px; margin-top: 5px;">
                    DESCUENTO ${descuento}%
                  </p>
                </div>
              ` : ''}
            </div>
          </div>
          
          <a href="https://tumarketing.com/cursos" style="display: inline-block; background: #ccff00; color: black; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 20px;">
            Ver Curso
          </a>
        </div>
        
        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">
          © 2024 TuMarketing. Todos los derechos reservados.
        </p>
      </div>
    `;

    // Enviar emails en lotes de 50 (límite de Resend)
    const batchSize = 50;
    let enviados = 0;
    let errores = 0;

    for (let i = 0; i < suscriptores.length; i += batchSize) {
      const batch = suscriptores.slice(i, i + batchSize);
      
      try {
        const result = await resend.emails.send({
          from: 'TuMarketing <cursos@tumarketing.com>',
          to: batch.map(s => s.email),
          subject: `🎓 Nuevo Curso: ${titulo}`,
          html: htmlContent
        });

        if (result.error) {
          errores += batch.length;
          console.error('Error enviando emails:', result.error);
        } else {
          enviados += batch.length;
        }
      } catch (error) {
        errores += batch.length;
        console.error('Error en lote:', error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Notificación enviada a ${enviados} suscriptores`,
      suscriptoresCount: enviados,
      errores
    });

  } catch (error) {
    const mensaje = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { error: 'Error al enviar notificación', details: mensaje },
      { status: 500 }
    );
  }
}
