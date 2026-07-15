"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { buscarPerfilAlumno, type PerfilAlumno } from "@/lib/alumnos";

// Chequea que haya una sesión activa y que el perfil ya exista en "usuarios"
// (es decir, que ya haya aceptado los términos en /auth/bienvenida).
// Redirige a /login si no está logueado, a /auth/bienvenida si le falta aceptar términos,
// o a /login si le revocaron el acceso.
export function useAlumnoSession() {
  const router = useRouter();
  const [perfil, setPerfil] = useState<PerfilAlumno | null>(null);
  const [usuario, setUsuario] = useState<User | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let vigente = true;

    const cargar = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }

      try {
        const perfilCargado = await buscarPerfilAlumno(user);
        if (!vigente) return;

        if (!perfilCargado) {
          router.replace("/auth/bienvenida");
          return;
        }

        if (!perfilCargado.activo) {
          await supabase.auth.signOut();
          router.replace("/login?revocado=1");
          return;
        }
        setPerfil(perfilCargado);
        setUsuario(user);
      } catch {
        router.replace("/login");
        return;
      } finally {
        if (vigente) setCargando(false);
      }
    };

    cargar();
    return () => { vigente = false; };
  }, [router]);

  return { perfil, usuario, cargando };
}
