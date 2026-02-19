'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Shield, UserPlus, Trash2 } from 'lucide-react';

interface UserRole {
  user_id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role_id: string;
  role_name: string;
  role_description: string | null;
  role_level: number;
  is_primary: boolean;
  assigned_at: string;
}

interface Role {
  id: string;
  name: string;
  description: string | null;
  level: number;
  is_system: boolean;
}

interface Permission {
  id: string;
  name: string;
  description: string | null;
  resource: string;
  action: string;
}

interface UsersManagementProps {
  users: UserRole[];
  roles: Role[];
  permissions: Permission[];
}

export function UsersManagement({ users, roles, permissions }: UsersManagementProps) {
  const [selectedUser, setSelectedUser] = useState<UserRole | null>(null);
  const [isAssigningRole, setIsAssigningRole] = useState(false);
  const supabase = createClient();

  // Agrupar usuarios por ID
  const groupedUsers = users.reduce((acc, user) => {
    if (!acc[user.user_id]) {
      acc[user.user_id] = {
        ...user,
        roles: [],
      };
    }
    acc[user.user_id].roles.push({
      role_id: user.role_id,
      role_name: user.role_name,
      role_description: user.role_description,
      role_level: user.role_level,
      is_primary: user.is_primary,
    });
    return acc;
  }, {} as Record<string, any>);

  const uniqueUsers = Object.values(groupedUsers);

  const handleAssignRole = async (userId: string, roleId: string) => {
    setIsAssigningRole(true);
    
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role_id: roleId,
          is_primary: false,
        });

      if (error) {
        toast.error('Error al asignar rol: ' + error.message);
      } else {
        toast.success('Rol asignado exitosamente');
        window.location.reload();
      }
    } catch (error) {
      toast.error('Error al asignar rol');
    } finally {
      setIsAssigningRole(false);
    }
  };

  const handleRemoveRole = async (userId: string, roleId: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role_id', roleId);

      if (error) {
        toast.error('Error al eliminar rol: ' + error.message);
      } else {
        toast.success('Rol eliminado exitosamente');
        window.location.reload();
      }
    } catch (error) {
      toast.error('Error al eliminar rol');
    }
  };

  const getRoleBadgeColor = (roleName: string) => {
    switch (roleName) {
      case 'super_admin':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'admin':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'manager':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'editor':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'viewer':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabla de Usuarios */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {uniqueUsers.map((user: any) => (
              <TableRow key={user.user_id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      {user.full_name?.charAt(0) || user.email?.charAt(0)}
                    </div>
                    <span className="font-medium">{user.full_name || 'Sin nombre'}</span>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map((role: any) => (
                      <Badge
                        key={role.role_id}
                        variant="outline"
                        className={getRoleBadgeColor(role.role_name)}
                      >
                        {role.role_name}
                        {role.is_primary && ' (P)'}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedUser(user)}
                      >
                        <Shield className="h-4 w-4 mr-1" />
                        Gestionar Roles
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Gestionar Roles</DialogTitle>
                        <DialogDescription>
                          Usuario: {user.full_name || user.email}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 mt-4">
                        {/* Roles actuales */}
                        <div>
                          <h4 className="text-sm font-medium mb-2">Roles Actuales</h4>
                          <div className="flex flex-wrap gap-2">
                            {user.roles.map((role: any) => (
                              <div
                                key={role.role_id}
                                className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full"
                              >
                                <span>{role.role_name}</span>
                                {!role.is_primary && (
                                  <button
                                    onClick={() => handleRemoveRole(user.user_id, role.role_id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Asignar nuevo rol */}
                        <div>
                          <h4 className="text-sm font-medium mb-2">Asignar Nuevo Rol</h4>
                          <div className="flex gap-2">
                            <Select
                              onValueChange={(value) => handleAssignRole(user.user_id, value)}
                              disabled={isAssigningRole}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Seleccionar rol" />
                              </SelectTrigger>
                              <SelectContent>
                                {roles
                                  .filter((role) => 
                                    !user.roles.some((r: any) => r.role_id === role.id)
                                  )
                                  .map((role) => (
                                    <SelectItem key={role.id} value={role.id}>
                                      {role.name} - {role.description}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Permisos del usuario */}
                        <div>
                          <h4 className="text-sm font-medium mb-2">Permisos del Usuario</h4>
                          <div className="max-h-48 overflow-y-auto border rounded-md p-2">
                            <div className="flex flex-wrap gap-1">
                              {permissions
                                .filter((perm) => {
                                  // Filtrar permisos según los roles del usuario
                                  return user.roles.some((role: any) => {
                                    // Aquí deberías verificar qué permisos tiene cada rol
                                    // Por ahora mostramos todos
                                    return true;
                                  });
                                })
                                .map((perm) => (
                                  <Badge
                                    key={perm.id}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {perm.resource}:{perm.action}
                                  </Badge>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Resumen de Roles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role) => (
          <div key={role.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold capitalize">{role.name}</h3>
              <Badge variant="outline">Nivel {role.level}</Badge>
            </div>
            <p className="text-sm text-gray-600 mb-2">{role.description}</p>
            <div className="text-xs text-gray-500">
              {role.is_system && 'Sistema'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
