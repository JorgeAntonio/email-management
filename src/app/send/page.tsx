"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Mail, Send, Eye, Save, Code2 } from "lucide-react";

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
      <li>{{empresa}} - Nombre de la empresa</li>
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
            {["{{nombre}}", "{{email}}", "{{empresa}}"].map((variable) => (
              <Button
                key={variable}
                variant="outline"
                size="sm"
                onClick={() => insertVariable(variable)}
              >
                {variable}
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
  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enviar Correo</h1>
          <p className="text-muted-foreground">
            Crea y envía un correo electrónico individual
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Vista Previa
          </Button>
          <Button>
            <Send className="mr-2 h-4 w-4" />
            Enviar Correo
          </Button>
        </div>
      </div>

      {/* Formulario */}
      <Card>
        <CardHeader>
          <CardTitle>Detalles del Correo</CardTitle>
          <CardDescription>
            Información del destinatario y asunto
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="to">Para</Label>
              <Input id="to" placeholder="correo@ejemplo.com" type="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Asunto</Label>
              <Input id="subject" placeholder="Asunto del correo" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="template">Plantilla (Opcional)</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar plantilla..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin plantilla</SelectItem>
                <SelectItem value="welcome">Bienvenida</SelectItem>
                <SelectItem value="newsletter">Newsletter</SelectItem>
                <SelectItem value="promo">Promoción</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Editor */}
      <EmailEditor />

      {/* Acciones */}
      <div className="flex justify-end gap-2">
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
          Enviar Correo
        </Button>
      </div>
    </div>
  );
}
