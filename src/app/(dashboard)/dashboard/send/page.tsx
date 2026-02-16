"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AudienceSelector, Contact } from "@/modules/audience/audience-selector";
import { Mail, Send, Eye, Save, Code2, Users, Target, User } from "lucide-react";

// Datos mock expandidos con campos adicionales
const mockContacts: Contact[] = [
  {
    id: 1,
    name: "Juan Carlos Pérez",
    email: "juan.perez@universidad.edu",
    type: "estudiante",
    group: "Estudiantes",
    enrollmentStatus: "matriculado",
    promotion: "2026-I",
    career: "ingenieria_sistemas",
    semester: 8,
    added: "2026-02-10",
  },
  {
    id: 2,
    name: "María García López",
    email: "maria.garcia@universidad.edu",
    type: "estudiante",
    group: "Estudiantes",
    enrollmentStatus: "matriculado",
    promotion: "2025-II",
    career: "medicina",
    semester: 6,
    added: "2026-02-09",
  },
  {
    id: 3,
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@universidad.edu",
    type: "estudiante",
    group: "Estudiantes",
    enrollmentStatus: "no_matriculado",
    promotion: "2024-I",
    career: "derecho",
    semester: 10,
    added: "2026-02-08",
  },
  {
    id: 4,
    name: "Ana Martínez Silva",
    email: "ana.martinez@universidad.edu",
    type: "estudiante",
    group: "Estudiantes",
    enrollmentStatus: "egresado",
    promotion: "2023-II",
    career: "administracion",
    semester: 10,
    added: "2026-02-07",
  },
  {
    id: 5,
    name: "Dr. Pedro Sánchez",
    email: "pedro.sanchez@universidad.edu",
    type: "docente",
    group: "Docentes",
    career: "ingenieria_sistemas",
    added: "2026-02-06",
  },
  {
    id: 6,
    name: "Dra. Laura González",
    email: "laura.gonzalez@universidad.edu",
    type: "docente",
    group: "Docentes",
    career: "medicina",
    added: "2026-02-05",
  },
  {
    id: 7,
    name: "Roberto Díaz",
    email: "roberto.diaz@empresa.com",
    type: "externo",
    group: "Externos",
    company: "Tech Corp",
    added: "2026-02-04",
  },
  {
    id: 8,
    name: "Carmen Vargas",
    email: "carmen.vargas@universidad.edu",
    type: "administrativo",
    group: "Administrativo",
    added: "2026-02-03",
  },
  {
    id: 9,
    name: "Luis Torres",
    email: "luis.torres@universidad.edu",
    type: "estudiante",
    group: "Estudiantes",
    enrollmentStatus: "pendiente",
    promotion: "2026-I",
    career: "contabilidad",
    semester: 2,
    added: "2026-02-02",
  },
  {
    id: 10,
    name: "Diana Flores",
    email: "diana.flores@universidad.edu",
    type: "estudiante",
    group: "Estudiantes",
    enrollmentStatus: "matriculado",
    promotion: "2025-I",
    career: "psicologia",
    semester: 7,
    added: "2026-02-01",
  },
  {
    id: 11,
    name: "Miguel Ángel Ruiz",
    email: "miguel.ruiz@empresa.com",
    type: "externo",
    group: "Externos",
    company: "Consultora ABC",
    added: "2026-01-31",
  },
  {
    id: 12,
    name: "Patricia Mendoza",
    email: "patricia.mendoza@universidad.edu",
    type: "estudiante",
    group: "Estudiantes",
    enrollmentStatus: "matriculado",
    promotion: "2024-II",
    career: "ingenieria_civil",
    semester: 9,
    added: "2026-01-30",
  },
];

// Componente del Editor HTML
function EmailEditor() {
  const [htmlContent, setHtmlContent] = useState(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Mi Correo</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #2563eb;">Hola {{nombre}}!</h1>
    <p>Este es un ejemplo de correo personalizado.</p>
    <p>Puedes usar variables como:</p>
    <ul>
      <li>{{nombre}} - Nombre del destinatario</li>
      <li>{{email}} - Correo electrónico</li>
      <li>{{carrera}} - Carrera (solo estudiantes)</li>
      <li>{{promocion}} - Promoción (solo estudiantes)</li>
    </ul>
    <p>Saludos cordiales,<br>Tu equipo</p>
  </div>
</body>
</html>`);

  const insertVariable = (variable: string) => {
    const textarea = document.getElementById("html-editor") as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = htmlContent.substring(0, start) + variable + htmlContent.substring(end);
      setHtmlContent(newContent);
    }
  };

  const variables = [
    { name: "{{nombre}}", desc: "Nombre" },
    { name: "{{email}}", desc: "Email" },
    { name: "{{carrera}}", desc: "Carrera" },
    { name: "{{promocion}}", desc: "Promoción" },
    { name: "{{semestre}}", desc: "Semestre" },
    { name: "{{tipo}}", desc: "Tipo de contacto" },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Editor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            Editor HTML
          </CardTitle>
          <CardDescription>
            Escribe el código HTML de tu correo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Variables:</span>
            {variables.map((variable) => (
              <Button
                key={variable.name}
                variant="outline"
                size="sm"
                onClick={() => insertVariable(variable.name)}
                title={variable.desc}
              >
                {variable.name}
              </Button>
            ))}
          </div>
          <Textarea
            id="html-editor"
            value={htmlContent}
            onChange={(e) => setHtmlContent(e.target.value)}
            className="min-h-[400px] font-mono text-sm"
            placeholder="Escribe tu HTML aquí..."
          />
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Vista Previa
          </CardTitle>
          <CardDescription>
            Así se verá tu correo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-white">
            <iframe
              srcDoc={htmlContent}
              className="h-[400px] w-full rounded-lg"
              sandbox="allow-scripts"
              title="Vista previa del correo"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SendEmailPage() {
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState("audience");

  const selectedContactsData = mockContacts.filter((c) =>
    selectedContacts.includes(c.id)
  );

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enviar Correo</h1>
          <p className="text-muted-foreground">
            Selecciona tu audiencia y crea tu mensaje
          </p>
        </div>
        <div className="flex items-center gap-4">
          {selectedContacts.length > 0 && (
            <Badge variant="secondary" className="text-sm">
              <Users className="mr-1 h-3 w-3" />
              {selectedContacts.length} destinatarios
            </Badge>
          )}
          <div className="flex gap-2">
            <Button variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              Vista Previa
            </Button>
            <Button disabled={selectedContacts.length === 0}>
              <Send className="mr-2 h-4 w-4" />
              Enviar Correo
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="audience" className="gap-2">
            <Target className="h-4 w-4" />
            1. Seleccionar Audiencia
            {selectedContacts.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {selectedContacts.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="compose" className="gap-2">
            <Mail className="h-4 w-4" />
            2. Componer Mensaje
          </TabsTrigger>
        </TabsList>

        <TabsContent value="audience" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Seleccionar Público Objetivo
              </CardTitle>
              <CardDescription>
                Filtra y selecciona los destinatarios de tu correo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AudienceSelector
                contacts={mockContacts}
                selectedContacts={selectedContacts}
                onSelectionChange={setSelectedContacts}
              />
            </CardContent>
          </Card>

          {selectedContacts.length > 0 && (
            <div className="flex justify-end">
              <Button onClick={() => setActiveTab("compose")} size="lg">
                Continuar a Componer Mensaje
                <Mail className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="compose" className="space-y-6">
          {/* Formulario */}
          <Card>
            <CardHeader>
              <CardTitle>Detalles del Correo</CardTitle>
              <CardDescription>
                Configura el asunto y la plantilla
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Asunto</Label>
                  <Input placeholder="Asunto del correo" />
                </div>
                <div className="space-y-2">
                  <Label>Plantilla (Opcional)</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar plantilla..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin plantilla</SelectItem>
                      <SelectItem value="welcome">Bienvenida</SelectItem>
                      <SelectItem value="newsletter">Newsletter</SelectItem>
                      <SelectItem value="promo">Promoción</SelectItem>
                      <SelectItem value="payment">Recordatorio de Pago</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Resumen de destinatarios */}
              <div className="rounded-lg border p-4 bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Destinatarios Seleccionados</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab("audience")}
                  >
                    Modificar selección
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedContactsData.slice(0, 5).map((contact) => (
                    <Badge key={contact.id} variant="secondary" className="gap-1">
                      <User className="h-3 w-3" />
                      {contact.name}
                    </Badge>
                  ))}
                  {selectedContactsData.length > 5 && (
                    <Badge variant="outline">
                      +{selectedContactsData.length - 5} más
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Editor */}
          <EmailEditor />

          {/* Acciones */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setActiveTab("audience")}>
              ← Volver a Audiencia
            </Button>
            <div className="flex gap-2">
              <Button variant="outline">
                <Save className="mr-2 h-4 w-4" />
                Guardar como Plantilla
              </Button>
              <Button variant="secondary">
                <Send className="mr-2 h-4 w-4" />
                Enviar Prueba
              </Button>
              <Button>
                <Mail className="mr-2 h-4 w-4" />
                Enviar a {selectedContacts.length} destinatarios
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
