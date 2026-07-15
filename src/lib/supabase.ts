import { createBrowserClient } from '@supabase/ssr'

// Traemos las variables de entorno que acabás de configurar
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Cliente de navegador: guarda la sesión en cookies (no localStorage) para que
// las Server Actions y Server Components puedan leer la misma sesión.
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)