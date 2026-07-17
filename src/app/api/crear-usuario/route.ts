import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Falta configurar SUPABASE_SERVICE_ROLE_KEY en el servidor." }, { status: 500 });
    }

    // Mismo patrón que /api/revocar-acceso: la service_role key solo se usa acá,
    // nunca en un componente "use client".
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY);

    const { email, nombre, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Faltan datos: email y password son requeridos." }, { status: 400 });
    }

    const { data: creado, error: errorAuth } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // el admin ya validó que el mail es real, no hace falta que confirme
    });

    if (errorAuth || !creado.user) {
      return NextResponse.json({ error: errorAuth?.message || "No pudimos crear el usuario." }, { status: 500 });
    }

    // Mismas columnas que crearPerfilAlumno (src/lib/alumnos.ts): acá el admin está
    // dando de alta la cuenta en nombre del cliente como parte de la contratación,
    // así que se registran los términos como aceptados igual que en el alta normal.
    const { error: errorPerfil } = await supabaseAdmin.from("usuarios").insert([
      {
        id: creado.user.id,
        email,
        nombre: nombre || null,
        rol: "alumno",
        activo: true,
        acepta_terminos: true,
        terminos_aceptados_en: new Date().toISOString(),
        acepta_newsletter: false,
      },
    ]);

    if (errorPerfil) {
      // El login ya existe en Auth aunque el perfil haya fallado: lo dejamos loggeado
      // para que el admin vea el error real en vez de un estado a medio crear silencioso.
      return NextResponse.json({ error: "El login se creó pero falló el perfil: " + errorPerfil.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, usuarioId: creado.user.id });
  } catch (err) {
    const mensaje = err instanceof Error ? err.message : "Error inesperado en el servidor.";
    return NextResponse.json({ error: mensaje }, { status: 500 });
  }
}
