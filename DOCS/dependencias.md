# Dependencias - MindCinema

## 1. Objetivo

Este documento resume las dependencias del MVP de MindCinema desde una perspectiva práctica de desarrollo.

MindCinema es una aplicación **frontend-only** con:

- React 18
- Vite
- TailwindCSS
- despliegue en Vercel

Además, consume datos de **TMDB API**, que es un **servicio externo** y **no una dependencia instalada por npm**.

Las versiones incluidas aquí son **orientativas** y deben validarse siempre contra el `package.json` real del proyecto.

---

## 2. Dependencias de producción

Estas son las dependencias mínimas esperables para el MVP.

| Paquete | Versión orientativa | Tipo | Justificación |
|---|---|---|---|
| `react` | `^18.x` | Producción | Librería principal para construir la interfaz y los componentes |
| `react-dom` | `^18.x` | Producción | Renderizado de React en el navegador |

### Nota sobre TMDB

**TMDB API no se instala con npm.**

Es un servicio HTTP externo consumido desde frontend mediante `fetch` u otra abstracción ligera. En la documentación de dependencias debe tratarse como:

- integración externa
- dependencia operativa del producto
- fuente de datos, no paquete instalado

---

## 3. Dependencias de desarrollo

Estas son las dependencias base para levantar, construir y estilizar el proyecto en el MVP.

| Paquete | Versión orientativa | Tipo | Justificación |
|---|---|---|---|
| `vite` | `^5.x` | Desarrollo | Bundler y servidor de desarrollo rápido para el proyecto |
| `@vitejs/plugin-react` | `^4.x` | Desarrollo | Integración oficial de React con Vite |
| `tailwindcss` | `^3.x` | Desarrollo | Sistema de utilidades CSS para construir la UI del MVP con rapidez |
| `postcss` | `^8.x` | Desarrollo | Procesamiento CSS requerido por Tailwind |
| `autoprefixer` | `^10.x` | Desarrollo | Añade prefijos CSS necesarios para compatibilidad razonable de navegador |

### Sobre Vercel

**Vercel no es una dependencia de npm obligatoria para este MVP.**

En este proyecto debe considerarse principalmente como:

- plataforma de despliegue
- entorno de hosting
- lugar donde configurar variables de entorno del frontend

Solo tendría sentido añadir una dependencia o herramienta de Vercel si más adelante se necesita automatizar flujos concretos desde CLI o integración local.

---

## 4. Política de actualización de dependencias

La política recomendada para el MVP es conservadora y simple.

### Reglas

- Mantener dependencias en versiones estables y ampliamente usadas
- Priorizar actualizaciones menores y parches antes que saltos mayores
- Validar cualquier cambio en local antes de mezclarlo
- Evitar actualizar varias dependencias críticas a la vez si no hay necesidad real

### Frecuencia recomendada

- Revisar parches de seguridad o correcciones: cuando aparezcan
- Revisar menores (`minor`): cada cierto ciclo de trabajo o antes de release relevante
- Revisar mayores (`major`): solo si aportan valor claro o resuelven deuda importante

### Dependencias críticas del MVP

Las que conviene revisar con más cuidado son:

- `react`
- `react-dom`
- `vite`
- `tailwindcss`

Un cambio mayor en cualquiera de ellas puede afectar:

- build
- configuración
- estilos
- compatibilidad entre plugins

---

## 5. Criterios para añadir nuevas dependencias

En un MVP frontend-only conviene ser estrictos. Cada nueva dependencia añade coste de mantenimiento.

### Añadir una dependencia solo si:

- resuelve un problema real que ya existe
- reduce complejidad respecto a una solución nativa razonable
- está bien mantenida y tiene adopción sólida
- no compromete innecesariamente el tamaño del bundle
- no introduce dependencia estructural de un backend inexistente

### Evitar añadir una dependencia si:

- React, el navegador o Tailwind ya resuelven el caso con poco código
- solo mejora ergonomía de forma marginal
- obliga a reorganizar demasiado el proyecto para un beneficio pequeño
- añade complejidad operativa en despliegue o configuración

### Pregunta de control recomendada

Antes de instalar una librería nueva:

`¿Esto reduce complejidad real del MVP o solo mueve la complejidad a un tercero?`

---

## 6. Riesgos principales y mitigación

### 1. Dependencia excesiva de servicios externos

Riesgo:

- la app depende de TMDB para mostrar contenido
- cambios de cuota, latencia o errores remotos afectan la experiencia

Mitigación:

- manejar estados de `loading`, `error` y `empty`
- tolerar respuestas parciales o campos nulos
- centralizar la capa de consumo y normalización de TMDB

### 2. Exposición de credenciales en frontend

Riesgo:

- al no existir backend propio, la credencial usada por TMDB queda expuesta en el cliente

Mitigación:

- usar variables de entorno del frontend y despliegue
- asumir que no hay secreto fuerte en cliente
- limitar el alcance operativo de la credencial según permita TMDB
- documentar esta limitación como decisión consciente del MVP

### 3. Crecimiento innecesario del bundle

Riesgo:

- añadir librerías para problemas pequeños empeora rendimiento y mantenimiento

Mitigación:

- preferir APIs nativas y utilidades pequeñas
- revisar el valor real antes de instalar dependencias nuevas
- evitar utilidades grandes si solo se usa una parte mínima

### 4. Incompatibilidades entre versiones

Riesgo:

- cambios entre Vite, React y Tailwind pueden romper el flujo de desarrollo o build

Mitigación:

- actualizar de forma gradual
- validar el proyecto en desarrollo y build antes de fusionar cambios
- registrar decisiones de actualización relevantes en documentación o changelog

### 5. Acoplamiento innecesario a herramientas de plataforma

Riesgo:

- usar características demasiado específicas de Vercel puede dificultar mover el proyecto en el futuro

Mitigación:

- mantener el proyecto como sitio estático estándar siempre que sea posible
- dejar la configuración de despliegue lo más simple y portable posible

---

## 7. Dependencias opcionales futuras

Estas no forman parte del stack confirmado del MVP. Solo deberían evaluarse si aparece una necesidad concreta.

| Categoría | Estado | Cuándo podría aportar valor |
|---|---|---|
| Enrutado (`react-router-dom`) | Opcional futuro | Si la app crece y necesita navegación real entre vistas o páginas |
| Cliente HTTP (`axios`) | Opcional futuro | Si el consumo de TMDB se vuelve más complejo y `fetch` deja de ser suficiente |
| Tipado estático (`typescript`) | Opcional futuro | Si se prioriza robustez de modelos, normalización y mantenibilidad a medio plazo |
| Gestión de caché de servidor (`@tanstack/react-query`) | Opcional futuro | Si aparecen reintentos, caché, sincronización o múltiples vistas consumiendo TMDB |

### Regla para esta sección

Estas dependencias **no deben aparecer en el proyecto como asumidas** hasta que exista una decisión explícita y su incorporación quede reflejada en el `package.json`.

---

## 8. Resumen práctico

Para el MVP inicial, MindCinema debería mantenerse con una base de dependencias muy pequeña:

- `react`
- `react-dom`
- `vite`
- `@vitejs/plugin-react`
- `tailwindcss`
- `postcss`
- `autoprefixer`

Todo lo demás debe justificarse caso a caso.

TMDB se trata como **servicio externo**, y Vercel como **plataforma de despliegue**, no como paquete central del proyecto.

---

## 9. Decisiones actuales del MVP

Por ahora, MindCinema se construirá con un stack mínimo y suficiente para validar el producto.

### Se asume en esta fase:

- Sin TypeScript
- Sin React Router obligatorio
- Sin librería externa para fetch
- Sin librería de estado global
- Sin sistema avanzado de caché
- Sin dependencias de backend

### Criterio

El objetivo es mantener el MVP simple, comprensible y fácil de evolucionar.  
Cualquier nueva dependencia deberá justificarse por una necesidad real del producto o del flujo de desarrollo.