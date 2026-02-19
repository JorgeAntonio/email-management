import { createClient } from '@/utils/supabase/server';
import { isAdmin } from '@/utils/roles';
import { redirect } from 'next/navigation';
import { UsersManagement } from './users-management';

export default async function AdminUsersPage() {
  const supabase = await createClient();
  
  // Verificar si es admin
  const admin = await isAdmin();
  if (!admin) {
    redirect('/dashboard?error=unauthorized');
  }

  // Obtener todos los usuarios con sus roles
  const { data: users, error: usersError } = await supabase
    .from('user_roles_view')
    .select('*');

  if (usersError) {
    console.error('Error fetching users:', usersError);
  }

  // Obtener todos los roles disponibles
  const { data: roles, error: rolesError } = await supabase
    .from('roles')
    .select('*')
    .order('level', { ascending: false });

  if (rolesError) {
    console.error('Error fetching roles:', rolesError);
  }

  // Obtener todos los permisos
  const { data: permissions, error: permError } = await supabase
    .from('permissions')
    .select('*')
    .order('resource');

  if (permError) {
    console.error('Error fetching permissions:', permError);
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Administración de Usuarios</h1>
      <UsersManagement 
        users={users || []} 
        roles={roles || []}
        permissions={permissions || []}
      />
    </div>
  );
}
