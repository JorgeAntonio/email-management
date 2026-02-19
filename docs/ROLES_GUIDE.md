# Sistema de Roles y Permisos - Supabase

Este sistema implementa un RBAC (Role-Based Access Control) completo para tu aplicación Next.js con Supabase.

## 📋 Tablas Creadas

### 1. **profiles**
Almacena información extendida de los usuarios:
- `id`: UUID (referencia a auth.users)
- `email`: Email del usuario
- `full_name`: Nombre completo
- `avatar_url`: URL del avatar
- `phone`, `company`, `job_title`, `bio`, `website`
- `timezone`, `language`
- `email_notifications`, `marketing_emails`
- `created_at`, `updated_at`

### 2. **roles**
Define los roles disponibles:
- `super_admin`: Acceso total (nivel 100)
- `admin`: Gestión completa excepto sistema (nivel 80)
- `manager`: Gestión de campañas y usuarios (nivel 60)
- `editor`: Crear y editar contenido (nivel 40)
- `viewer`: Solo lectura (nivel 20)
- `user`: Usuario básico (nivel 10)

### 3. **permissions**
Permisos individuales del sistema:
- Recursos: `users`, `campaigns`, `audience`, `analytics`, `templates`, `settings`, `roles`
- Acciones: `create`, `read`, `update`, `delete`, `manage`, `send`, `schedule`, `import`, `export`

### 4. **role_permissions**
Relación many-to-many entre roles y permisos.

### 5. **user_roles**
Relación many-to-many entre usuarios y roles:
- Soporte para múltiples roles por usuario
- Rol principal (`is_primary`)
- Fecha de asignación y expiración opcional

## 🚀 Configuración Inicial

### Paso 1: Ejecutar el SQL

1. Ve al **SQL Editor** de Supabase
2. Crea un **New Query**
3. Copia y pega el contenido de `supabase/migrations/001_roles_and_profiles.sql`
4. Ejecuta el script

### Paso 2: Configurar el Primer Admin

```sql
-- Reemplaza 'USER-UUID-AQUI' con el UUID del primer usuario
INSERT INTO public.user_roles (user_id, role_id, is_primary)
SELECT 
    'USER-UUID-AQUI',
    id,
    true
FROM public.roles 
WHERE name = 'super_admin';
```

Para obtener el UUID del usuario:
```sql
SELECT id, email FROM auth.users LIMIT 5;
```

### Paso 3: Configurar Google OAuth (para perfiles automáticos)

En tu Supabase Dashboard:
1. Ve a **Authentication > Providers**
2. Habilita **Google**
3. Configura el **Authorized Redirect URI**: `http://localhost:3000/auth/callback`
4. En **URL Configuration**:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

## 📦 Archivos Creados

### Utilidades
- `src/utils/roles.ts` - Funciones server-side para verificar roles/permisos
- `src/utils/supabase/server.ts` - Cliente Supabase para Server Components
- `src/utils/supabase/client.ts` - Cliente Supabase para Client Components

### Hooks
- `src/hooks/use-auth.ts` - Hooks para usar roles y permisos en componentes cliente:
  - `useAuth()` - Información del usuario
  - `useRoles()` - Roles y verificaciones
  - `usePermissions()` - Permisos del usuario
  - `useProfile()` - Perfil y actualización

### Middleware
- `middleware.ts` - Protección de rutas basada en roles/permisos

### Páginas de Admin
- `src/app/admin/users/page.tsx` - Gestión de usuarios y roles
- `src/app/admin/users/users-management.tsx` - Componente de gestión

### Ejemplos
- `src/app/examples/permission-example.tsx` - Ejemplo de uso de permisos

## 🔐 Uso en tu Código

### Server Components

```typescript
import { hasRole, hasPermission, can, isAdmin } from '@/utils/roles';

// En un Server Component
export default async function AdminPage() {
  // Verificar si es admin
  const admin = await isAdmin();
  if (!admin) {
    redirect('/dashboard');
  }

  // Verificar rol específico
  const isManager = await hasRole('manager');
  
  // Verificar permiso específico
  const canCreateCampaigns = await hasPermission('campaigns:create');
  
  // Verificar acción sobre recurso
  const canEditUsers = await can('update', 'users');

  return <div>Panel de Admin</div>;
}
```

### Client Components

```typescript
'use client';

import { useRoles, usePermissions } from '@/hooks/use-auth';

export function CampaignButton() {
  const { isAdmin, hasRole } = useRoles();
  const { can, hasPermission } = usePermissions();

  return (
    <div>
      {/* Mostrar botón solo si tiene permiso */}
      {can('create', 'campaigns') && (
        <Button>Crear Campaña</Button>
      )}

      {/* Mostrar solo para admins */}
      {isAdmin() && (
        <Button variant="destructive">Eliminar Todo</Button>
      )}

      {/* Verificar rol específico */}
      {hasRole('editor') && (
        <Button variant="outline">Editar Contenido</Button>
      )}
    </div>
  );
}
```

### Middleware (Protección de Rutas)

El middleware automáticamente:
- Protege rutas que requieren autenticación
- Verifica permisos específicos por ruta
- Redirige usuarios no autorizados

Rutas configuradas en `middleware.ts`:
```typescript
const routePermissions: Record<string, string[]> = {
  "/admin": ["super_admin", "admin"],
  "/admin/roles": ["super_admin"],
  "/campaigns/create": ["campaigns:create"],
  "/audience/import": ["audience:import"],
  // ... más rutas
};
```

## 🔧 Funciones RPC Disponibles

### has_permission(user_uuid, permission_name)
Verifica si un usuario tiene un permiso específico.

```sql
SELECT has_permission('user-uuid', 'campaigns:create');
```

### has_role(user_uuid, role_name)
Verifica si un usuario tiene un rol específico.

```sql
SELECT has_role('user-uuid', 'admin');
```

### has_any_role(user_uuid, role_names[])
Verifica si un usuario tiene alguno de los roles especificados.

```sql
SELECT has_any_role('user-uuid', ARRAY['admin', 'manager']);
```

### get_user_level(user_uuid)
Obtiene el nivel más alto del usuario.

```sql
SELECT get_user_level('user-uuid');
```

### get_user_permissions(user_uuid)
Obtiene todos los permisos del usuario.

```sql
SELECT * FROM get_user_permissions('user-uuid');
```

## 📝 Flujo Automático

Cuando un usuario se registra:

1. **Trigger** `on_auth_user_created` se ejecuta automáticamente
2. Se crea un **perfil** en la tabla `profiles` con los datos del usuario
3. Se asigna automáticamente el rol **"user"** (básico)
4. El usuario puede iniciar sesión y usar la aplicación con permisos limitados

## 🎨 Personalización

### Agregar Nuevos Roles

```sql
INSERT INTO public.roles (name, description, level, is_system) 
VALUES ('moderator', 'Moderador de contenido', 50, false);
```

### Agregar Nuevos Permisos

```sql
INSERT INTO public.permissions (name, description, resource, action)
VALUES ('reports:view', 'Ver reportes avanzados', 'reports', 'view');
```

### Asignar Permisos a un Rol

```sql
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.name = 'moderator'
AND p.resource = 'reports';
```

## 🚨 Seguridad

- **RLS (Row Level Security)** habilitado en todas las tablas
- Políticas definidas para controlar quién puede ver/modificar datos
- Solo `super_admin` puede modificar roles y permisos del sistema
- Usuarios solo pueden ver/editar su propio perfil
- Admins pueden ver todos los perfiles y asignar roles

## 🐛 Troubleshooting

### El perfil no se crea automáticamente

1. Verificar que el trigger existe:
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

2. Verificar que la función existe:
```sql
SELECT * FROM pg_proc WHERE proname = 'handle_new_user';
```

3. Crear manualmente si es necesario:
```sql
INSERT INTO public.profiles (id, email, full_name)
VALUES ('user-uuid', 'user@email.com', 'Nombre');
```

### Error "permission denied"

Verificar que el usuario tiene el rol adecuado:
```sql
SELECT * FROM public.user_roles_view WHERE user_id = 'user-uuid';
```

### No puedo acceder a /admin

Asegúrate de asignar el rol super_admin:
```sql
INSERT INTO public.user_roles (user_id, role_id, is_primary)
SELECT 'tu-uuid', id, true FROM public.roles WHERE name = 'super_admin';
```

## 📚 Recursos Adicionales

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)

## ✅ Checklist de Implementación

- [ ] Ejecutar SQL en Supabase
- [ ] Configurar primer usuario como super_admin
- [ ] Configurar Google OAuth (opcional)
- [ ] Probar login/logout
- [ ] Verificar creación automática de perfiles
- [ ] Probar asignación de roles
- [ ] Verificar middleware protege rutas correctamente
- [ ] Probar hooks en componentes cliente
- [ ] Verificar que solo admins acceden a /admin
