import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { titulo, descripcion, imagen_url } = await request.json();

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

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ccff00 0%, #b8e600 100%); padding: 20px; border-radius: 10px; text-align: center;">
          <h1 style="color: black; margin: 0;">📝 ¡Nuevo Artículo en el Blog!</h1>
        </div>
        
        <div style="background: #f5f5f5; padding: 30px; border-radius: 10px; margin-top: 20px;">
          ${imagen_url ? `<img src="${imagen_url}" alt="${titulo}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 8px; margin-bottom: 20px;" />` : ''}
          
          <h2 style="color: #333; font-size: 24px;">${titulo}</h2>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            ${descripcion || 'Lee el artículo completo en nuestro blog'}
          </p>
          
          <a href="https://tumarketing.com/recursos" style="display: inline-block; background: #ccff00; color: black; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 20px;">
            Leer Artículo Completo
          </a>
        </div>
        
        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">
          © 2024 TuMarketing. Todos los derechos reservados.
        </p>
      </div>
    `;

    // Enviar emails en lotes de 50
    const batchSize = 50;
    let enviados = 0;
    let errores = 0;

    for (let i = 0; i < suscriptores.length; i += batchSize) {
      const batch = suscriptores.slice(i, i + batchSize);
      
      try {
        const result = await resend.emails.send({
          from: 'TuMarketing Blog <blog@tumarketing.com>',
          to: batch.map(s => s.email),
          subject: `📝 Nuevo Artículo: ${titulo}`,
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
