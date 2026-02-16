import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Save, Mail, Bell, Shield } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">
          Administra la configuración del sistema
        </p>
      </div>

      <Tabs defaultValue="smtp" className="space-y-6">
        <TabsList>
          <TabsTrigger value="smtp">
            <Mail className="mr-2 h-4 w-4" />
            SMTP
          </TabsTrigger>
          <TabsTrigger value="general">
            <Settings className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notificaciones
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" />
            Seguridad
          </TabsTrigger>
        </TabsList>

        {/* SMTP Settings */}
        <TabsContent value="smtp" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración SMTP</CardTitle>
              <CardDescription>
                Configura tu servidor de correo saliente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="smtp-host">Servidor SMTP</Label>
                  <Input id="smtp-host" placeholder="smtp.ejemplo.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">Puerto</Label>
                  <Input id="smtp-port" placeholder="587" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-user">Usuario</Label>
                <Input id="smtp-user" placeholder="usuario@ejemplo.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-pass">Contraseña</Label>
                <Input id="smtp-pass" type="password" placeholder="••••••••" />
              </div>
              <div className="flex items-center gap-2">
                <Switch id="smtp-ssl" />
                <Label htmlFor="smtp-ssl">Usar SSL/TLS</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
              <CardDescription>
                Datos de tu organización
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Nombre de la Empresa</Label>
                <Input id="company-name" placeholder="Tu Empresa S.A." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="default-sender">Remitente por Defecto</Label>
                <Input id="default-sender" placeholder="noreccion@tuempresa.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reply-to">Responder a</Label>
                <Input id="reply-to" placeholder="soporte@tuempresa.com" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias de Notificación</CardTitle>
              <CardDescription>
                Configura cuándo y cómo recibir notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Alertas de fallos de envío</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibe notificaciones cuando un correo falle
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Reportes diarios</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibe un resumen diario de la actividad
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificaciones de campañas completadas</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibe alerta cuando termine una campaña
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Gestiona tus claves de API para integraciones externas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">API Key de Producción</p>
                    <p className="text-sm text-muted-foreground">Usada para envíos en vivo</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Regenerar
                  </Button>
                </div>
                <code className="mt-2 block rounded bg-muted p-2 text-sm">
                  sk_live_••••••••••••••••••••••
                </code>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Guardar Cambios
        </Button>
      </div>
    </div>
  );
}
