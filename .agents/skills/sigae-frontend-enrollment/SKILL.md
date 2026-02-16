# Skill: Arquitectura y sistema de fetching — sigae-frontend-enrollment

## 📌 Resumen rápido
- **Tipo de proyecto:** Next.js (app router) + TypeScript + TailwindCSS.  
- **Patrón de fetching:** capa centralizada por módulos (ApiClient + buildHeaders) que consume servicios externos configurados por env vars.  
- **Objetivo de este documento:** describir arquitectura, configuración y flujo de datos para facilitar mantenimiento y extensión.

---

## 🏗️ Arquitectura general
- Next.js App Router (carpeta `src/app`) con componentes server/client según necesidad.  
- Estructura modular: features en `src/modules`, lógica de fetching en `src/api`, utilidades en `src/lib`, UI en `src/components` y tipos en `src/types`.
- Fetching totalmente **config-driven** (URLs y tokens por módulo en `src/config/modules.cofig.ts`).

## 📁 Carpetas clave y responsabilidad
- `src/app/` — layouts y pages (app router).  
- `src/modules/` — páginas/feature modules (domain-driven).  
- `src/components/` — componentes UI y atomos.  
- `src/api/` — wrappers por dominio (server-side helpers).  
- `src/api/core/` — capa HTTP reutilizable (ApiClient, buildHeaders, fetchCore, métodos).  
- `src/config/` — `modules.cofig.ts` (URLs/TOKENS) y `endpoints.config.ts` (rutas REST).  
- `src/lib/` — sesión (`session.ts`), `prisma.ts`, utilidades.  
- `src/types/` — interfaces y shapes de las respuestas (ej. `IResApi<T>`).

---

## 🔁 Flujo y diseño del fetching (explicación técnica)
1. **Configuración por módulo**
   - `SERVICES_MODULES` en `src/config/modules.cofig.ts` define URL_PROD / URL_LOCAL y TOKEN por módulo (STUDENT, PERSON, CORE, ...).
2. **Rutas centralizadas**
   - `ENDPOINTS_CONFIG` en `src/config/endpoints.config.ts` contiene los path segments reutilizables por dominio.
3. **ApiClient (capa HTTP reusable)**
   - `src/api/core/api-clients.ts` construye `baseUrl` desde `SERVICES_MODULES` y expone métodos: `get`, `post`, `put`, `patch`, `delete`.
   - Añade `Content-Type` automáticamente salvo cuando se usa FormData (`isFormData`).
4. **BuildHeaders & sesión**
   - `buildHeaders(module)` (server) lee cookie `${APP_NAME}_session`, desencripta el JWT (`src/lib/session.ts`) y añade:
     - `app-token` (token del módulo, si existe)
     - `Authorization: Bearer <user_token>` (si hay sesión)
     - `user-token` (uuid_user)
5. **Clients por módulo**
   - `src/api/core/fetch-services.ts` expone instancias como `fetchPersonService`, `fetchUserService`, etc., para usarse en los wrappers.
6. **Wrappers por dominio**
   - Archivos en `src/api/<domain>/*.ts` (ej. `src/api/persons/person.ts`) usan `fetchXService` + `ENDPOINTS_CONFIG` para llamadas y retornan objetos tipados: `{ status, data?, errors? }`.
   - Usan `use server` (server actions / server components) para ejecutar fetch en el servidor.
7. **fetchCore / headerClient**
   - `fetchCore` es una alternativa de bajo nivel (server-only) que arma headers con cookie desencriptada y compone URL desde `SERVICES_MODULES`.

> Resultado: peticiones coherentes, centralizadas y con control de tokens (app-token + Authorization). Las funciones de dominio encapsulan parsing y manejo de errores.

---

## 🔒 Sesión y autenticación
- Sesión en cookie JWT (`${APP_NAME}_session`) generada por `src/lib/session.ts` (JOSE HS256) y con helpers: `createSession`, `decrypt`, `getSession`, `deleteSession`.
- `buildHeaders` y `fetchCore` usan la sesión para inyectar `Authorization` en cada petición.
- `src/api/auth/refresh-session.ts` implementa refresh y re-escribe la cookie.

---

## 🧰 Tipos y manejo de respuestas
- Respuestas paginadas usan `IResApi<T>` (`src/types/core/IResApi.ts`).
- Convención en wrappers: devolver `{ status, data?, errors? }` y normalizar mensajes de error (flatten arrays).

---

## ⚙️ Variables de configuración importantes
Definidas en `next.config.ts` y usadas en `modules.cofig.ts`:
- APP_NAME, SESSION_SECRET
- APP_API_*_SERVICE (ej. APP_API_PERSON_SERVICE, APP_API_CORE_SERVICE, etc.)
- APP_API_*_SERVICE_LOCAL (dev)
- APP_TOKEN_STUDENT, APP_TOKEN_ADMIN (app-tokens por módulo)
- DATABASE_URL, NEXTAUTH_SECRET, GOOGLE_CLIENT_* (si aplica)

---

## ➕ Soporte para archivos y FormData
- `ApiClient.post/put/patch(..., isFormData = true)` evita `Content-Type: application/json` y envía `FormData` bruto.
- Endpoints de upload usan ese flag (ej. `src/api/files/upload-files.ts`).

---

## ✅ Cómo agregar un nuevo servicio/endpoint (pasos rápidos)
1. Añadir entrada en `src/config/modules.cofig.ts` (URL_PROD, URL_LOCAL, TOKEN opcional).
2. Añadir path en `src/config/endpoints.config.ts` (BASE_PATHS o nuevo grupo).
3. Consumir desde `src/api/core/fetch-services.ts` (si quieres un client nuevo) o usar `new ApiClient('MI_MODULO')`.
4. Crear wrapper en `src/api/<mi-domain>/...ts` que use el client (`fetchMyModuleService.get/post(ENDPOINTS_CONFIG.MY.XYZ)`).
5. Añadir tipos en `src/types` y tests si aplica.

---

## 📌 Archivos clave (revisar)
- `src/config/modules.cofig.ts` — URLs/TOKENS por módulo
- `src/config/endpoints.config.ts` — paths REST centralizados
- `src/api/core/api-clients.ts` — ApiClient (base HTTP)
- `src/api/core/build-headers.ts` — inyección de headers (app-token + Authorization)
- `src/api/core/fetch-services.ts` — instancias por módulo
- `src/lib/session.ts` — encrypt/decrypt cookie-session
- `src/api/<domain>/*.ts` — wrappers por dominio
- `src/types/` — shapes y `IResApi<T>`

---

## 🔍 Ejemplo de uso (patrón típico)
```ts
// src/api/persons/person.ts (patrón)
const response = await fetchPersonService.get(`${ENDPOINTS_CONFIG.PERSON.PERSON}?page=1`)
if (!response.ok) throw new Error('...')
const data = await response.json() as IResApi<IPerson>
return { status: response.status, data }
```

---

## 💡 Buenas prácticas / observaciones
- Todas las llamadas pasan por una capa que añade tokens; eso facilita auditoría y pruebas.  
- Uso consistente de `ENDPOINTS_CONFIG` reduce errores en rutas.  
- Considerar: añadir retries/exponential backoff y un mapeador central de errores HTTP.  
- Para peticiones que deben ser cliente-side puro (download público), usar utilidades como `getUserServiceUrl()`.

---

## 📎 Conclusión
- El proyecto tiene un **sistema de fetching bien estructurado y centralizado**: módulos configurables → ApiClient → wrappers por dominio.  
- Esto facilita: cambios de endpoint, añadir tokens por módulo y propagar autenticación de usuario automáticamente.
