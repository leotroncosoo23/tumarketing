"use client";

import { useState } from "react";
import { suscribirNewsletter } from "@/lib/newsletter-actions";

// Estado y lógica de envío compartidos por los distintos formularios de
// newsletter del sitio (la página /newsletter y la sección de la home),
// para que ambos guarden en Supabase de la misma forma.
export function useNewsletterForm() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aceptaTerminos) return;

    setError("");
    setEnviando(true);

    const resultado = await suscribirNewsletter(nombre.trim(), email.trim());

    if (resultado?.error) {
      setError(resultado.error);
      setEnviando(false);
      return;
    }

    setExito(true);
    setEnviando(false);
  };

  return { nombre, setNombre, email, setEmail, aceptaTerminos, setAceptaTerminos, enviando, error, exito, handleSubmit };
}
