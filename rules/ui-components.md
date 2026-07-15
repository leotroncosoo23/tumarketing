# Skill: Frontend, UI y Estilos (React, Next.js & Tailwind CSS)

## Stack y Convenciones
- Framework: Next.js (App Router).
- Componentes: React funcional.
- Lenguaje: TypeScript (archivos `.tsx`).
- Estilos: EXCLUSIVAMENTE Tailwind CSS. No usar CSS tradicional ni archivos `.css` separados a menos que sea estrictamente necesario para configuraciones globales.

## Reglas de Diseño y Estética (Tailwind CSS)
- **Mobile-First:** Diseñar SIEMPRE pensando primero en dispositivos móviles. Usar las clases base para móvil y luego aplicar breakpoints (`sm:`, `md:`, `lg:`, `xl:`) para adaptar el diseño a pantallas más grandes.
- **Responsividad Absoluta:** Garantizar que todos los componentes (banners, carruseles, tarjetas de cursos) sean fluidos. Evitar anchos o altos fijos (`w-px`, `h-px`) que rompan el diseño; priorizar porcentajes, flexbox (`flex`) y grid (`grid`).
- **Consistencia Visual:** Utilizar la escala de espaciado (`p-4`, `m-2`, `gap-6`) y tipografía (`text-sm`, `text-2xl`, `font-bold`) estándar de Tailwind para mantener una estética limpia, moderna y profesional orientada a conversiones (Marketing).
- **Interactividad:** Añadir estados sutiles pero efectivos (ej. `hover:bg-blue-600`, `focus:ring`, `transition-all duration-300`) para mejorar la experiencia del usuario (UX).

## Arquitectura de Carpetas
- Componentes globales y reutilizables (ej. `Navbar.tsx`, `AnuncioBanner.tsx`, `ServiciosCarousel.tsx`) deben ir en `src/components/`.
- Las rutas de la aplicación deben respetar la estructura del App Router en `src/app/` (usando `page.tsx` y `layout.tsx`).

## Reglas de Renderizado y Rendimiento
- Por defecto, utilizar Server Components para maximizar la velocidad de carga y el SEO (vital para el sector de blogs y recursos gratuitos).
- Utilizar `"use client"` únicamente cuando el componente requiera interactividad (hooks como useState, useEffect, onClick) o animaciones específicas del cliente.
- Tipar siempre las interfaces de las `props` de los componentes con TypeScript.