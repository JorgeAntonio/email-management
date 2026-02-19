'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRoles, usePermissions } from '@/hooks/use-auth';
import { Shield, Users, Lock, Eye, Edit, Trash } from 'lucide-react';

export function PermissionExample() {
  const { roles, hasRole, isAdmin, isSuperAdmin, loading: rolesLoading } = useRoles();
  const { permissions, hasPermission, can, loading: permLoading } = usePermissions();

  if (rolesLoading || permLoading) {
    return <div>Cargando permisos...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Información de Roles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Tus Roles
          </CardTitle>
          <CardDescription>
            Roles asignados a tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {roles.map((role: any) => (
                <span
                  key={role.id}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    role.is_primary
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {role.roles?.name || role.roles?.[0]?.name}
                  {role.is_primary && ' (Principal)'}
                </span>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-2">
                <span className={isAdmin() ? 'text-green-600' : 'text-red-600'}>
                  {isAdmin() ? '✓' : '✗'}
                </span>
                <span>Es Administrador</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={isSuperAdmin() ? 'text-green-600' : 'text-red-600'}>
                  {isSuperAdmin() ? '✓' : '✗'}
                </span>
                <span>Es Super Admin</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={hasRole('editor') ? 'text-green-600' : 'text-red-600'}>
                  {hasRole('editor') ? '✓' : '✗'}
                </span>
                <span>Es Editor</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={hasRole('viewer') ? 'text-green-600' : 'text-red-600'}>
                  {hasRole('viewer') ? '✓' : '✗'}
                </span>
                <span>Es Visualizador</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permisos de Campañas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Permisos de Campañas
          </CardTitle>
          <CardDescription>
            Acciones que puedes realizar con las campañas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>Ver campañas:</span>
              <span className={can('read', 'campaigns') ? 'text-green-600' : 'text-red-600'}>
                {can('read', 'campaigns') ? 'Sí' : 'No'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              <span>Crear campañas:</span>
              <span className={can('create', 'campaigns') ? 'text-green-600' : 'text-red-600'}>
                {can('create', 'campaigns') ? 'Sí' : 'No'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              <span>Editar campañas:</span>
              <span className={can('update', 'campaigns') ? 'text-green-600' : 'text-red-600'}>
                {can('update', 'campaigns') ? 'Sí' : 'No'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Trash className="h-4 w-4" />
              <span>Eliminar campañas:</span>
              <span className={can('delete', 'campaigns') ? 'text-green-600' : 'text-red-600'}>
                {can('delete', 'campaigns') ? 'Sí' : 'No'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Gestionar campañas:</span>
              <span className={can('manage', 'campaigns') ? 'text-green-600' : 'text-red-600'}>
                {can('manage', 'campaigns') ? 'Sí' : 'No'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permisos de Usuarios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Permisos de Usuarios
          </CardTitle>
          <CardDescription>
            Acciones que puedes realizar con los usuarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>Ver usuarios:</span>
              <span className={can('read', 'users') ? 'text-green-600' : 'text-red-600'}>
                {can('read', 'users') ? 'Sí' : 'No'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              <span>Crear usuarios:</span>
              <span className={can('create', 'users') ? 'text-green-600' : 'text-red-600'}>
                {can('create', 'users') ? 'Sí' : 'No'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Gestionar roles:</span>
              <span className={can('manage', 'roles') ? 'text-green-600' : 'text-red-600'}>
                {can('manage', 'roles') ? 'Sí' : 'No'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ejemplo de Botones Condicionales */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Condicionales</CardTitle>
          <CardDescription>
            Botones que solo aparecen según tus permisos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {can('create', 'campaigns') && (
              <Button>Crear Campaña</Button>
            )}
            {can('create', 'templates') && (
              <Button variant="outline">Crear Plantilla</Button>
            )}
            {can('import', 'audience') && (
              <Button variant="secondary">Importar Contactos</Button>
            )}
            {can('manage', 'users') && (
              <Button variant="destructive">Gestionar Usuarios</Button>
            )}
            {can('manage', 'settings') && (
              <Button variant="ghost">Configuración del Sistema</Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lista completa de permisos */}
      <Card>
        <CardHeader>
          <CardTitle>Todos tus Permisos</CardTitle>
          <CardDescription>
            Lista completa de permisos asignados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {permissions.map((perm: any, index: number) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
              >
                {perm.resource}:{perm.action}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
