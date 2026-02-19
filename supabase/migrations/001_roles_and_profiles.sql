-- ============================================================================
-- SISTEMA DE ROLES Y PERFILES PARA SUPABASE
-- ============================================================================
-- Este script configura:
-- 1. Tabla de perfiles (profiles)
-- 2. Tabla de roles (roles)
-- 3. Tabla de permisos (permissions)
-- 4. Tabla de roles-permisos (role_permissions)
-- 5. Tabla de usuarios-roles (user_roles)
-- 6. Trigger para crear perfil automáticamente
-- 7. Políticas RLS para seguridad
-- ============================================================================

-- Habilitar extensión UUID si no existe
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. TABLA DE PERFILES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    company TEXT,
    job_title TEXT,
    bio TEXT,
    website TEXT,
    timezone TEXT DEFAULT 'UTC',
    language TEXT DEFAULT 'es',
    email_notifications BOOLEAN DEFAULT true,
    marketing_emails BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Comentarios para documentación
COMMENT ON TABLE public.profiles IS 'Perfiles de usuarios extendidos';
COMMENT ON COLUMN public.profiles.id IS 'ID del usuario (referencia a auth.users)';
COMMENT ON COLUMN public.profiles.full_name IS 'Nombre completo del usuario';
COMMENT ON COLUMN public.profiles.avatar_url IS 'URL de la imagen de perfil';
COMMENT ON COLUMN public.profiles.company IS 'Empresa del usuario';
COMMENT ON COLUMN public.profiles.job_title IS 'Cargo/título del trabajo';

-- ============================================================================
-- 2. TABLA DE ROLES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    level INTEGER DEFAULT 0, -- Nivel jerárquico (0 = más bajo, mayor número = más permisos)
    is_system BOOLEAN DEFAULT false, -- Roles del sistema que no se pueden eliminar
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Comentarios
COMMENT ON TABLE public.roles IS 'Roles disponibles en el sistema';
COMMENT ON COLUMN public.roles.level IS 'Nivel jerárquico del rol (mayor = más permisos)';
COMMENT ON COLUMN public.roles.is_system IS 'Indica si es un rol del sistema (no eliminable)';

-- ============================================================================
-- 3. TABLA DE PERMISOS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    resource TEXT NOT NULL, -- Ej: 'campaigns', 'users', 'settings'
    action TEXT NOT NULL,   -- Ej: 'create', 'read', 'update', 'delete', 'manage'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Comentarios
COMMENT ON TABLE public.permissions IS 'Permisos individuales del sistema';
COMMENT ON COLUMN public.permissions.resource IS 'Recurso al que aplica el permiso';
COMMENT ON COLUMN public.permissions.action IS 'Acción permitida sobre el recurso';

-- ============================================================================
-- 4. TABLA DE ROLES-PERMISOS (Many-to-Many)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.role_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(role_id, permission_id)
);

COMMENT ON TABLE public.role_permissions IS 'Relación entre roles y permisos';

-- ============================================================================
-- 5. TABLA DE USUARIOS-ROLES (Many-to-Many)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES auth.users(id), -- Quién asignó el rol
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE, -- Opcional: expiración del rol
    is_primary BOOLEAN DEFAULT false, -- Rol principal del usuario
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, role_id)
);

COMMENT ON TABLE public.user_roles IS 'Roles asignados a cada usuario';
COMMENT ON COLUMN public.user_roles.is_primary IS 'Indica si es el rol principal del usuario';

-- ============================================================================
-- 6. INSERTAR ROLES POR DEFECTO
-- ============================================================================
INSERT INTO public.roles (name, description, level, is_system) VALUES
    ('super_admin', 'Super Administrador - Acceso total al sistema', 100, true),
    ('admin', 'Administrador - Gestión completa excepto configuración del sistema', 80, true),
    ('manager', 'Gerente - Puede gestionar campañas y usuarios', 60, true),
    ('editor', 'Editor - Puede crear y editar contenido', 40, true),
    ('viewer', 'Visualizador - Solo lectura', 20, true),
    ('user', 'Usuario básico - Acceso limitado', 10, true)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- 7. INSERTAR PERMISOS POR DEFECTO
-- ============================================================================
INSERT INTO public.permissions (name, description, resource, action) VALUES
    -- Permisos de usuarios
    ('users:create', 'Crear usuarios', 'users', 'create'),
    ('users:read', 'Ver usuarios', 'users', 'read'),
    ('users:update', 'Actualizar usuarios', 'users', 'update'),
    ('users:delete', 'Eliminar usuarios', 'users', 'delete'),
    ('users:manage', 'Gestionar usuarios completamente', 'users', 'manage'),
    
    -- Permisos de campañas
    ('campaigns:create', 'Crear campañas', 'campaigns', 'create'),
    ('campaigns:read', 'Ver campañas', 'campaigns', 'read'),
    ('campaigns:update', 'Actualizar campañas', 'campaigns', 'update'),
    ('campaigns:delete', 'Eliminar campañas', 'campaigns', 'delete'),
    ('campaigns:manage', 'Gestionar campañas completamente', 'campaigns', 'manage'),
    ('campaigns:send', 'Enviar campañas', 'campaigns', 'send'),
    ('campaigns:schedule', 'Programar campañas', 'campaigns', 'schedule'),
    
    -- Permisos de audiencia/contactos
    ('audience:create', 'Crear contactos', 'audience', 'create'),
    ('audience:read', 'Ver contactos', 'audience', 'read'),
    ('audience:update', 'Actualizar contactos', 'audience', 'update'),
    ('audience:delete', 'Eliminar contactos', 'audience', 'delete'),
    ('audience:import', 'Importar contactos', 'audience', 'import'),
    ('audience:export', 'Exportar contactos', 'audience', 'export'),
    
    -- Permisos de analíticas
    ('analytics:read', 'Ver analíticas', 'analytics', 'read'),
    ('analytics:export', 'Exportar reportes', 'analytics', 'export'),
    
    -- Permisos de plantillas
    ('templates:create', 'Crear plantillas', 'templates', 'create'),
    ('templates:read', 'Ver plantillas', 'templates', 'read'),
    ('templates:update', 'Actualizar plantillas', 'templates', 'update'),
    ('templates:delete', 'Eliminar plantillas', 'templates', 'delete'),
    
    -- Permisos de configuración
    ('settings:read', 'Ver configuración', 'settings', 'read'),
    ('settings:update', 'Actualizar configuración', 'settings', 'update'),
    ('settings:manage', 'Gestionar configuración del sistema', 'settings', 'manage'),
    
    -- Permisos de roles
    ('roles:manage', 'Gestionar roles y permisos', 'roles', 'manage'),
    ('roles:assign', 'Asignar roles a usuarios', 'roles', 'assign')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- 8. ASIGNAR PERMISOS A ROLES
-- ============================================================================
-- Super Admin: Todos los permisos
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT 
    r.id,
    p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.name = 'super_admin'
ON CONFLICT DO NOTHING;

-- Admin: Todos excepto gestión de roles del sistema
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT 
    r.id,
    p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.name = 'admin' 
    AND p.name NOT IN ('roles:manage', 'settings:manage')
ON CONFLICT DO NOTHING;

-- Manager: Gestión de campañas, audiencia y templates
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT 
    r.id,
    p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.name = 'manager' 
    AND p.resource IN ('campaigns', 'audience', 'templates', 'analytics')
    AND p.action IN ('create', 'read', 'update', 'delete', 'send', 'schedule', 'import', 'export')
ON CONFLICT DO NOTHING;

-- Editor: Crear y editar campañas y templates
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT 
    r.id,
    p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.name = 'editor' 
    AND p.resource IN ('campaigns', 'templates')
    AND p.action IN ('create', 'read', 'update')
ON CONFLICT DO NOTHING;

-- Viewer: Solo lectura
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT 
    r.id,
    p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.name = 'viewer' 
    AND p.action = 'read'
ON CONFLICT DO NOTHING;

-- User: Solo lectura básica
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT 
    r.id,
    p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.name = 'user' 
    AND p.resource IN ('campaigns', 'templates')
    AND p.action = 'read'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 9. TRIGGER PARA CREAR PERFIL AUTOMÁTICAMENTE
-- ============================================================================
-- Función que se ejecuta cuando se crea un nuevo usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    default_role_id UUID;
BEGIN
    -- Crear el perfil del usuario
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        avatar_url,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
        NEW.raw_user_meta_data->>'avatar_url',
        NOW(),
        NOW()
    );
    
    -- Asignar rol por defecto (user)
    SELECT id INTO default_role_id FROM public.roles WHERE name = 'user' LIMIT 1;
    
    IF default_role_id IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, role_id, is_primary)
        VALUES (NEW.id, default_role_id, true);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que se ejecuta después de insertar en auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 10. TRIGGER PARA ACTUALIZAR updated_at
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at
DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS roles_updated_at ON public.roles;
CREATE TRIGGER roles_updated_at
    BEFORE UPDATE ON public.roles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Usuarios pueden ver su propio perfil"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Usuarios pueden actualizar su propio perfil"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Admins pueden ver todos los perfiles"
    ON public.profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid()
            AND r.name IN ('super_admin', 'admin')
        )
    );

CREATE POLICY "Admins pueden actualizar cualquier perfil"
    ON public.profiles FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid()
            AND r.name IN ('super_admin', 'admin')
        )
    );

-- Políticas para roles
CREATE POLICY "Todos pueden ver roles"
    ON public.roles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Solo super_admin puede modificar roles"
    ON public.roles FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid()
            AND r.name = 'super_admin'
        )
    );

-- Políticas para permissions
CREATE POLICY "Todos pueden ver permisos"
    ON public.permissions FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Solo super_admin puede modificar permisos"
    ON public.permissions FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid()
            AND r.name = 'super_admin'
        )
    );

-- Políticas para role_permissions
CREATE POLICY "Todos pueden ver role_permissions"
    ON public.role_permissions FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Solo super_admin puede modificar role_permissions"
    ON public.role_permissions FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid()
            AND r.name = 'super_admin'
        )
    );

-- Políticas para user_roles
CREATE POLICY "Usuarios pueden ver sus propios roles"
    ON public.user_roles FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Admins pueden ver todos los user_roles"
    ON public.user_roles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid()
            AND r.name IN ('super_admin', 'admin')
        )
    );

CREATE POLICY "Solo super_admin y admin pueden asignar roles"
    ON public.user_roles FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid()
            AND r.name IN ('super_admin', 'admin')
        )
    );

CREATE POLICY "Solo super_admin y admin pueden modificar user_roles"
    ON public.user_roles FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid()
            AND r.name IN ('super_admin', 'admin')
        )
    );

-- ============================================================================
-- 12. FUNCIONES AUXILIARES
-- ============================================================================

-- Función para verificar si un usuario tiene un permiso específico
CREATE OR REPLACE FUNCTION public.has_permission(user_uuid UUID, permission_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.user_roles ur
        JOIN public.role_permissions rp ON ur.role_id = rp.role_id
        JOIN public.permissions p ON rp.permission_id = p.id
        WHERE ur.user_id = user_uuid
        AND p.name = permission_name
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para verificar si un usuario tiene un rol específico
CREATE OR REPLACE FUNCTION public.has_role(user_uuid UUID, role_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.user_roles ur
        JOIN public.roles r ON ur.role_id = r.id
        WHERE ur.user_id = user_uuid
        AND r.name = role_name
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para verificar si un usuario tiene alguno de los roles especificados
CREATE OR REPLACE FUNCTION public.has_any_role(user_uuid UUID, role_names TEXT[])
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.user_roles ur
        JOIN public.roles r ON ur.role_id = r.id
        WHERE ur.user_id = user_uuid
        AND r.name = ANY(role_names)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener el nivel del usuario
CREATE OR REPLACE FUNCTION public.get_user_level(user_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN COALESCE(
        (SELECT MAX(r.level)
         FROM public.user_roles ur
         JOIN public.roles r ON ur.role_id = r.id
         WHERE ur.user_id = user_uuid),
        0
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener todos los permisos de un usuario
CREATE OR REPLACE FUNCTION public.get_user_permissions(user_uuid UUID)
RETURNS TABLE(permission_name TEXT, resource TEXT, action TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT p.name, p.resource, p.action
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON ur.role_id = rp.role_id
    JOIN public.permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 13. VISTAS ÚTILES
-- ============================================================================

-- Vista de usuarios con sus roles
CREATE OR REPLACE VIEW public.user_roles_view AS
SELECT 
    u.id as user_id,
    u.email,
    p.full_name,
    p.avatar_url,
    r.id as role_id,
    r.name as role_name,
    r.description as role_description,
    r.level as role_level,
    ur.is_primary,
    ur.assigned_at,
    ur.expires_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
LEFT JOIN public.roles r ON ur.role_id = r.id;

-- Vista de roles con sus permisos
CREATE OR REPLACE VIEW public.role_permissions_view AS
SELECT 
    r.id as role_id,
    r.name as role_name,
    r.description as role_description,
    p.id as permission_id,
    p.name as permission_name,
    p.resource,
    p.action,
    p.description as permission_description
FROM public.roles r
LEFT JOIN public.role_permissions rp ON r.id = rp.role_id
LEFT JOIN public.permissions p ON rp.permission_id = p.id;

-- ============================================================================
-- INSTRUCCIONES DE USO
-- ============================================================================
/*

1. EJECUTAR EN SQL EDITOR DE SUPABASE:
   - Copia todo este script en el SQL Editor de Supabase
   - Ejecuta el script completo

2. VERIFICAR INSTALACIÓN:
   SELECT * FROM public.roles;
   SELECT * FROM public.permissions;
   SELECT * FROM public.role_permissions_view;

3. ASIGNAR ROL ADMIN AL PRIMER USUARIO:
   -- Reemplaza 'user-uuid-aqui' con el UUID del primer usuario
   INSERT INTO public.user_roles (user_id, role_id, is_primary)
   SELECT 
       'user-uuid-aqui',
       id,
       true
   FROM public.roles 
   WHERE name = 'super_admin';

4. EN TU APLICACIÓN NEXT.JS:
   
   -- Verificar si tiene permiso
   const hasPerm = await supabase.rpc('has_permission', {
       user_uuid: userId,
       permission_name: 'campaigns:create'
   });
   
   -- Verificar si tiene rol
   const hasRole = await supabase.rpc('has_role', {
       user_uuid: userId,
       role_name: 'admin'
   });
   
   -- Verificar si tiene alguno de los roles
   const hasAnyRole = await supabase.rpc('has_any_role', {
       user_uuid: userId,
       role_names: ['admin', 'manager']
   });
   
   -- Obtener permisos del usuario
   const { data: permissions } = await supabase.rpc('get_user_permissions', {
       user_uuid: userId
   });

5. POLÍTICAS RLS IMPORTANTES:
   - Usuarios solo pueden ver/editar SU propio perfil
   - Solo super_admin puede modificar roles y permisos del sistema
   - Admins pueden ver todos los perfiles y asignar roles

6. ROLES POR DEFECTO (de menor a mayor nivel):
   - user (10): Usuario básico
   - viewer (20): Solo lectura
   - editor (40): Crear y editar
   - manager (60): Gestión completa
   - admin (80): Admin sin acceso a sistema
   - super_admin (100): Acceso total

*/
