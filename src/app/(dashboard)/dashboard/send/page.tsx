"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEmailSender } from "@/modules/email/hooks/use-email-sender";
import { emailTemplates } from "@/modules/email/templates/email-templates";
import { 
  Mail, 
  Send, 
  Eye, 
  Users, 
  Plus,
  X,
  Check,
  AlertCircle,
  Loader2,
  FileText,
  ChevronRight,
  Sparkles
} from "lucide-react";

// Tipos
interface Recipient {
  id: string;
  email: string;
  name: string;
}

// Templates organizados por categoría
const templateCategories = [
  { id: 'all', name: 'Todos' },
  { id: 'basic', name: 'Básicos' },
  { id: 'newsletter', name: 'Newsletter' },
  { id: 'promotional', name: 'Promocional' },
  { id: 'welcome', name: 'Bienvenida' },
  { id: 'transactional', name: 'Transaccional' },
];

export default function SendEmailPage() {
  // Estados
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [newRecipientEmail, setNewRecipientEmail] = useState("");
  const [newRecipientName, setNewRecipientName] = useState("");
  const [subject, setSubject] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [activeTab, setActiveTab] = useState("recipients");
  const [testEmail, setTestEmail] = useState("");
  const [templateFilter, setTemplateFilter] = useState("all");
  
  const { sendEmail, isLoading } = useEmailSender();

  // Filtrar templates
  const filteredTemplates = templateFilter === 'all' 
    ? emailTemplates 
    : emailTemplates.filter(t => t.category === templateFilter);

  // Agregar destinatario
  const addRecipient = () => {
    if (!newRecipientEmail) return;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newRecipientEmail)) {
      return;
    }

    const newRecipient: Recipient = {
      id: Date.now().toString(),
      email: newRecipientEmail,
      name: newRecipientName || newRecipientEmail.split('@')[0],
    };

    setRecipients([...recipients, newRecipient]);
    setNewRecipientEmail("");
    setNewRecipientName("");
  };

  // Eliminar destinatario
  const removeRecipient = (id: string) => {
    setRecipients(recipients.filter(r => r.id !== id));
  };

  // Seleccionar template
  const handleSelectTemplate = (templateId: string) => {
    const template = emailTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setHtmlContent(template.html);
    }
  };

  // Enviar email
  const handleSendEmail = async () => {
    if (recipients.length === 0 || !subject || !htmlContent) return;

    const to = recipients.map(r => r.email);
    await sendEmail({
      to,
      subject,
      html: htmlContent,
    });
  };

  // Enviar prueba
  const handleSendTest = async () => {
    if (!testEmail || !subject || !htmlContent) return;

    await sendEmail({
      to: testEmail,
      subject: `[PRUEBA] ${subject}`,
      html: htmlContent,
    });
  };

  // Procesar HTML con variables
  const processHtml = (html: string) => {
    let processed = html;
    processed = processed.replace(/{{nombre}}/g, 'Juan Pérez');
    processed = processed.replace(/{{email}}/g, 'juan@ejemplo.com');
    processed = processed.replace(/{{fecha}}/g, new Date().toLocaleDateString('es-ES'));
    processed = processed.replace(/{{asunto}}/g, subject || 'Asunto del correo');
    processed = processed.replace(/{{mes}}/g, new Date().toLocaleDateString('es-ES', { month: 'long' }));
    processed = processed.replace(/{{año}}/g, new Date().getFullYear().toString());
    return processed;
  };

  const canProceedToCompose = recipients.length > 0;
  const canSend = recipients.length > 0 && subject.trim() && htmlContent.trim();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Enviar Correo</h1>
          </div>
          <p className="text-slate-500 ml-11">
            Crea y envía emails profesionales a tu audiencia
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border shadow-sm p-1 rounded-xl">
            <TabsTrigger 
              value="recipients" 
              className="rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white px-6"
            >
              <Users className="h-4 w-4 mr-2" />
              1. Destinatarios
              {recipients.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-violet-100 text-violet-700">
                  {recipients.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="compose"
              disabled={!canProceedToCompose}
              className="rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white px-6"
            >
              <FileText className="h-4 w-4 mr-2" />
              2. Componer
            </TabsTrigger>
            <TabsTrigger 
              value="preview"
              disabled={!canSend}
              className="rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white px-6"
            >
              <Eye className="h-4 w-4 mr-2" />
              3. Revisar y Enviar
            </TabsTrigger>
          </TabsList>

          {/* Paso 1: Destinatarios */}
          <TabsContent value="recipients" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 border-0 shadow-lg bg-white/80 backdrop-blur">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-slate-800">Agregar Destinatarios</CardTitle>
                  <CardDescription>
                    Agrega emails manualmente o pega una lista separada por comas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-700">Email</Label>
                      <Input
                        placeholder="correo@ejemplo.com"
                        value={newRecipientEmail}
                        onChange={(e) => setNewRecipientEmail(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addRecipient()}
                        className="border-slate-200 focus:border-violet-500 focus:ring-violet-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700">Nombre (opcional)</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Juan Pérez"
                          value={newRecipientName}
                          onChange={(e) => setNewRecipientName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addRecipient()}
                          className="border-slate-200 focus:border-violet-500 focus:ring-violet-500"
                        />
                        <Button 
                          onClick={addRecipient}
                          disabled={!newRecipientEmail}
                          className="bg-violet-600 hover:bg-violet-700"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-3">
                    <Label className="text-slate-700">Lista de Destinatarios</Label>
                    {recipients.length === 0 ? (
                      <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                        <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-400">No hay destinatarios agregados</p>
                        <p className="text-sm text-slate-400 mt-1">
                          Agrega emails arriba o pega múltiples emails
                        </p>
                      </div>
                    ) : (
                      <ScrollArea className="h-[300px] border rounded-lg p-4">
                        <div className="space-y-2">
                          {recipients.map((recipient) => (
                            <div
                              key={recipient.id}
                              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg group hover:bg-slate-100 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                                  {recipient.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-medium text-slate-800">{recipient.name}</p>
                                  <p className="text-sm text-slate-500">{recipient.email}</p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeRecipient(recipient.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-violet-50 to-purple-50">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-800">Resumen</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-6">
                    <div className="text-5xl font-bold text-violet-600 mb-2">
                      {recipients.length}
                    </div>
                    <p className="text-slate-600">Destinatarios</p>
                  </div>
                  
                  {recipients.length > 0 && (
                    <Button 
                      className="w-full bg-slate-900 hover:bg-slate-800"
                      onClick={() => setActiveTab("compose")}
                    >
                      Continuar
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Paso 2: Componer */}
          <TabsContent value="compose" className="space-y-6">
            <div className="grid lg:grid-cols-5 gap-6">
              {/* Panel de Templates */}
              <Card className="lg:col-span-2 border-0 shadow-lg bg-white/80 backdrop-blur h-fit">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-violet-500" />
                    <CardTitle className="text-lg text-slate-800">Plantillas</CardTitle>
                  </div>
                  <CardDescription>
                    Selecciona un diseño o comienza desde cero
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select value={templateFilter} onValueChange={setTemplateFilter}>
                    <SelectTrigger className="border-slate-200">
                      <SelectValue placeholder="Filtrar por categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {templateCategories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3 pr-4">
                      {filteredTemplates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => handleSelectTemplate(template.id)}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                            selectedTemplate === template.id
                              ? 'border-violet-500 bg-violet-50'
                              : 'border-slate-100 hover:border-violet-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              selectedTemplate === template.id
                                ? 'bg-violet-500 text-white'
                                : 'bg-slate-100 text-slate-500'
                            }`}>
                              <FileText className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-slate-800">{template.name}</h4>
                              <p className="text-sm text-slate-500 mt-1">{template.description}</p>
                              <Badge variant="secondary" className="mt-2 text-xs">
                                {templateCategories.find(c => c.id === template.category)?.name}
                              </Badge>
                            </div>
                            {selectedTemplate === template.id && (
                              <Check className="h-5 w-5 text-violet-500" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Editor */}
              <Card className="lg:col-span-3 border-0 shadow-lg bg-white/80 backdrop-blur">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-slate-800">Componer Mensaje</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-700">Asunto</Label>
                    <Input
                      placeholder="Escribe el asunto de tu correo..."
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="border-slate-200 focus:border-violet-500 focus:ring-violet-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-slate-700">Contenido HTML</Label>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-violet-600">
                            <Eye className="h-4 w-4 mr-1" />
                            Vista Previa
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl h-[80vh]">
                          <DialogHeader>
                            <DialogTitle>Vista Previa</DialogTitle>
                            <DialogDescription>
                              Así se verá tu correo
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex-1 bg-slate-100 rounded-lg overflow-hidden">
                            <iframe
                              srcDoc={processHtml(htmlContent)}
                              className="w-full h-full min-h-[500px] bg-white"
                              sandbox="allow-scripts"
                              title="Preview"
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <Textarea
                      placeholder="<html>...</html>"
                      value={htmlContent}
                      onChange={(e) => setHtmlContent(e.target.value)}
                      className="min-h-[400px] font-mono text-sm border-slate-200 focus:border-violet-500 focus:ring-violet-500"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-4">
                    <Button variant="outline" onClick={() => setActiveTab("recipients")}>
                      ← Volver
                    </Button>
                    <Button 
                      onClick={() => setActiveTab("preview")}
                      disabled={!subject || !htmlContent}
                      className="bg-slate-900 hover:bg-slate-800"
                    >
                      Revisar y Enviar
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Paso 3: Preview y Enviar */}
          <TabsContent value="preview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Preview */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-800">Vista Previa del Email</CardTitle>
                  <CardDescription>
                    Revisa cómo se verá tu correo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-100 rounded-lg overflow-hidden" style={{ height: '600px' }}>
                    <iframe
                      srcDoc={processHtml(htmlContent)}
                      className="w-full h-full bg-white"
                      sandbox="allow-scripts"
                      title="Email Preview"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Panel de Envío */}
              <div className="space-y-6">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-lg text-slate-800">Resumen del Envío</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-500 mb-1">Asunto</p>
                      <p className="font-medium text-slate-800">{subject}</p>
                    </div>
                    
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-500 mb-1">Destinatarios</p>
                      <p className="font-medium text-slate-800">{recipients.length} contactos</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {recipients.slice(0, 5).map(r => (
                          <Badge key={r.id} variant="secondary" className="text-xs">
                            {r.email}
                          </Badge>
                        ))}
                        {recipients.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{recipients.length - 5} más
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* Enviar prueba */}
                    <div className="space-y-3">
                      <Label className="text-slate-700">Enviar prueba primero</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="tu@email.com"
                          value={testEmail}
                          onChange={(e) => setTestEmail(e.target.value)}
                          className="border-slate-200"
                        />
                        <Button
                          variant="outline"
                          onClick={handleSendTest}
                          disabled={!testEmail || isLoading}
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-1" />
                              Probar
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    {/* Botón de envío final */}
                    <div className="pt-2">
                      <Button
                        onClick={handleSendEmail}
                        disabled={!canSend || isLoading}
                        className="w-full h-12 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Send className="h-5 w-5 mr-2" />
                            Enviar a {recipients.length} destinatarios
                          </>
                        )}
                      </Button>
                      
                      {!canSend && (
                        <div className="flex items-center gap-2 mt-3 text-amber-600 text-sm">
                          <AlertCircle className="h-4 w-4" />
                          <span>Completa todos los campos para enviar</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-center">
                  <Button variant="ghost" onClick={() => setActiveTab("compose")}>
                    ← Volver a editar
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
