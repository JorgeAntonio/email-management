import { createClient } from '@/utils/supabase/server';

/**
 * Verifica si el usuario actual tiene un permiso específico
 */
export async function hasPermission(permissionName: string): Promise<boolean> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;
  
  const { data, error } = await supabase.rpc('has_permission', {
    user_uuid: user.id,
    permission_name: permissionName
  });
  
  if (error) {
    console.error('Error checking permission:', error);
    return false;
  }
  
  return data || false;
}

/**
 * Verifica si el usuario actual tiene un rol específico
 */
export async function hasRole(roleName: string): Promise<boolean> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;
  
  const { data, error } = await supabase.rpc('has_role', {
    user_uuid: user.id,
    role_name: roleName
  });
  
  if (error) {
    console.error('Error checking role:', error);
    return false;
  }
  
  return data || false;
}

/**
 * Verifica si el usuario actual tiene alguno de los roles especificados
 */
export async function hasAnyRole(roleNames: string[]): Promise<boolean> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;
  
  for (const roleName of roleNames) {
    const { data, error } = await supabase.rpc('has_role', {
      user_uuid: user.id,
      role_name: roleName
    });
    
    if (!error && data) return true;
  }
  
  return false;
}

/**
 * Obtiene el nivel del usuario actual
 */
export async function getCurrentUserLevel(): Promise<number> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return 0;
  
  const { data, error } = await supabase.rpc('get_user_level', {
    user_uuid: user.id
  });
  
  if (error) {
    console.error('Error getting user level:', error);
    return 0;
  }
  
  return data || 0;
}

/**
 * Obtiene todos los permisos del usuario actual
 */
export async function getCurrentUserPermissions(): Promise<Array<{
  permission_name: string;
  resource: string;
  action: string;
}>> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];
  
  const { data, error } = await supabase.rpc('get_user_permissions', {
    user_uuid: user.id
  });
  
  if (error) {
    console.error('Error getting user permissions:', error);
    return [];
  }
  
  return data || [];
}

/**
 * Obtiene el perfil del usuario actual
 */
export async function getCurrentUserProfile() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  if (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
  
  return data;
}

/**
 * Obtiene los roles del usuario actual
 */
export async function getCurrentUserRoles() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];
  
  const { data, error } = await supabase
    .from('user_roles')
    .select(`
      id,
      is_primary,
      assigned_at,
      roles:role_id (
        id,
        name,
        description,
        level
      )
    `)
    .eq('user_id', user.id);
  
  if (error) {
    console.error('Error getting user roles:', error);
    return [];
  }
  
  return data || [];
}

/**
 * Verifica si el usuario puede realizar una acción sobre un recurso
 */
export async function can(
  action: 'create' | 'read' | 'update' | 'delete' | 'manage' | 'send' | 'schedule' | 'import' | 'export',
  resource: string
): Promise<boolean> {
  return hasPermission(`${resource}:${action}`);
}

/**
 * Verifica si el usuario es administrador
 */
export async function isAdmin(): Promise<boolean> {
  return hasAnyRole(['super_admin', 'admin']);
}

/**
 * Verifica si el usuario es super admin
 */
export async function isSuperAdmin(): Promise<boolean> {
  return hasRole('super_admin');
}
