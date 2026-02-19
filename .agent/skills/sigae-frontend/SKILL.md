---
document_type: technical_skill
project: sigae-frontend-enrollment
module: architecture_fetching
author: George's Coding
tags: [nextjs, typescript, fetching, api-client, auth]
---

# Documentación Técnica: Arquitectura y Sistema de Fetching

## 📌 RESUMEN EJECUTIVO

Este documento detalla la lógica de consumo de APIs para el proyecto **sigae-frontend**. El sistema utiliza un patrón de **ApiClient centralizado** diseñado para manejar múltiples microservicios con autenticación automatizada.

- **Stack Base:** Next.js (App Router), TypeScript, TailwindCSS.
- **Patrón:** Capa centralizada por módulos (ApiClient + buildHeaders).
- **Objetivo:** Facilitar el mantenimiento, la escalabilidad y la inyección automática de tokens de seguridad.

## 🏗️ ARQUITECTURA GENERAL DEL PROYECTO

El proyecto sigue una estructura modular para separar las responsabilidades de la UI, la lógica de negocio y la comunicación con el servidor.

### Organización de Carpetas (Responsabilidades)

| Carpeta         | Responsabilidad Técnica                                            |
| :-------------- | :----------------------------------------------------------------- |
| `src/app/`      | Rutas, layouts y manejo de páginas (App Router).                   |
| `src/modules/`  | Lógica de dominio y componentes específicos de features.           |
| `src/api/`      | Wrappers de dominio y servicios (Server-side helpers).             |
| `src/api/core/` | Núcleo HTTP: ApiClient, buildHeaders y fetchCore.                  |
| `src/config/`   | Configuración estática de endpoints y variables de módulos.        |
| `src/lib/`      | Utilidades core: Gestión de sesión (`session.ts`) y base de datos. |
| `src/types/`    | Contratos de interfaces y tipos globales (ej. `IResApi<T>`).       |

## 🔁 FLUJO TÉCNICO DE FETCHING

El ciclo de vida de una petición sigue una jerarquía de capas para asegurar que cada llamada incluya los metadatos necesarios.

### 1. Capa de Configuración

- **Modules Config:** `src/config/modules.cofig.ts` define las URLs base (PROD/LOCAL) y tokens de aplicación por módulo (STUDENT, PERSON, CORE, etc.).
- **Endpoints Config:** `src/config/endpoints.config.ts` centraliza los paths relativos para evitar hard-coding en los servicios.

### 2. Capa de Cliente (ApiClient)

Ubicada en `src/api/core/api-clients.ts`, esta clase abstrae el `fetch` nativo:

- Construye la `baseUrl` dinámicamente según el módulo.
- Expone métodos estándar: `get`, `post`, `put`, `patch`, `delete`.
- Detecta automáticamente `FormData` para omitir el header `Content-Type: application/json`.

### 3. Capa de Seguridad (Headers & Sesión)

La función `buildHeaders(module)` es crítica para la seguridad:

- Recupera la cookie `${APP_NAME}_session`.
- Desencripta el JWT usando la lógica en `src/lib/session.ts`.
- Inyecta automáticamente los headers:
  - `app-token`: Identificador del módulo.
  - `Authorization`: Token Bearer del usuario (si existe sesión).
  - `user-token`: UUID del usuario autenticado.

## 🔒 GESTIÓN DE AUTENTICACIÓN

- **Persistencia:** Se utiliza una cookie JWT gestionada mediante la librería `JOSE` (HS256).
- **Helpers:** `createSession`, `decrypt`, `getSession` y `deleteSession` centralizan la lógica de estado.
- **Refresh:** `src/api/auth/refresh-session.ts` permite renovar la sesión sin intervención manual del usuario.

## 🧰 CONVENCIÓN DE RESPUESTAS Y TIPADO

Para mantener la consistencia en el frontend, todos los wrappers de dominio deben:

1. Retornar un objeto con la forma: `{ status, data?, errors? }`.
2. Utilizar la interfaz `IResApi<T>` para respuestas paginadas o estandarizadas.
3. Normalizar los errores provenientes del backend (flattening de arrays de error).

## ✅ GUÍA: CÓMO AGREGAR UN NUEVO SERVICIO

1. **Configurar URL:** Registrar el servicio en `src/config/modules.cofig.ts`.
2. **Definir Path:** Añadir el endpoint en `src/config/endpoints.config.ts`.
3. **Instanciar Cliente:** Crear o usar una instancia en `src/api/core/fetch-services.ts`.
4. **Crear Wrapper:** Implementar la función de dominio en `src/api/<nuevo-dominio>/` usando `use server`.

## 🔍 EJEMPLO DE IMPLEMENTACIÓN (PATRÓN)

```ts
// src/api/persons/person.ts
const response = await fetchPersonService.get(
  `${ENDPOINTS_CONFIG.PERSON.PERSON}?page=1`,
);
if (!response.ok)
  return { status: response.status, errors: ["Error al obtener datos"] };

const data = (await response.json()) as IResApi<IPerson>;
return { status: response.status, data };
```

## 💡 BUENAS PRÁCTICAS RECOMENDADAS

- **Centralización**: No realizar llamadas directas a fetch desde componentes; usar siempre los wrappers de src/api/.
- **Server-Only**: Priorizar el uso de use server para proteger los tokens de aplicación.
- **Mapeo de Errores**: Implementar un mapeador central de códigos de estado HTTP para mostrar mensajes amigables al usuario.
