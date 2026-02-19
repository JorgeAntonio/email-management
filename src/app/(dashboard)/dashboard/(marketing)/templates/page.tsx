"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { emailTemplates, EmailTemplate } from "@/modules/email/templates/email-templates";
import {
  Plus,
  Search,
  Edit,
  Copy,
  Trash2,
  Eye,
  Code,
  Layout,
  Sparkles,
  MoreVertical,
  Save,
  X,
  Monitor,
  Smartphone,
  Tablet
} from "lucide-react";

// Generador de IDs seguro para React 19
let idCounter = 0;
const generateId = () => {
  idCounter += 1;
  return `template_${idCounter}_${Math.random().toString(36).substr(2, 9)}`;
};

// Variables disponibles para los templates
const availableVariables = [
  { key: "{{nombre}}", description: "Nombre del destinatario" },
  { key: "{{email}}", description: "Email del destinatario" },
  { key: "{{fecha}}", description: "Fecha actual" },
  { key: "{{hora}}", description: "Hora actual" },
  { key: "{{asunto}}", description: "Asunto del correo" },
  { key: "{{mes}}", description: "Mes actual" },
  { key: "{{año}}", description: "Año actual" },
  { key: "{{empresa}}", description: "Nombre de la empresa" },
];

// Snippets de HTML útiles
const htmlSnippets = [
  { name: "Botón Primario", html: '<a href="#" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">Acción</a>' },
  { name: "Tarjeta", html: '<table role="presentation" style="width: 100%; border-collapse: collapse; margin: 24px 0;"><tr><td style="background-color: #f7fafc; border-radius: 12px; padding: 24px; border-left: 4px solid #667eea;"><h3 style="color: #2d3748; font-size: 18px; font-weight: 600; margin: 0 0 12px 0;">Título</h3><p style="color: #4a5568; font-size: 15px; line-height: 1.6; margin: 0;">Contenido de la tarjeta aquí</p></td></tr></table>' },
  { name: "Imagen", html: '<img src="https://via.placeholder.com/600x300" alt="Descripción" style="width: 100%; max-width: 600px; height: auto; border-radius: 8px; display: block;" />' },
  { name: "Divider", html: '<div style="width: 40px; height: 2px; background-color: #e0e0e0; margin: 32px 0;"></div>' },
  { name: "Footer", html: '<table role="presentation" style="width: 100%; border-collapse: collapse;"><tr><td style="padding: 24px 40px; background-color: #f8f9fa; text-align: center;"><p style="color: #718096; font-size: 13px; margin: 0 0 8px 0;">¿Tienes preguntas? Responde a este correo</p><p style="color: #a0aec0; font-size: 12px; margin: 0;">© 2026 EmailSent. Todos los derechos reservados.</p></td></tr></table>' },
];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(emailTemplates);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    category: "basic" as EmailTemplate["category"],
    html: emailTemplates[0].html,
  });

  // Filtrar templates
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Categorías
  const categories = [
    { id: "all", name: "Todos", count: templates.length },
    { id: "basic", name: "Básicos", count: templates.filter(t => t.category === "basic").length },
    { id: "newsletter", name: "Newsletter", count: templates.filter(t => t.category === "newsletter").length },
    { id: "promotional", name: "Promocional", count: templates.filter(t => t.category === "promotional").length },
    { id: "welcome", name: "Bienvenida", count: templates.filter(t => t.category === "welcome").length },
    { id: "transactional", name: "Transaccional", count: templates.filter(t => t.category === "transactional").length },
  ];

  // Crear nuevo template
  const handleCreateTemplate = useCallback(() => {
    const template: EmailTemplate = {
      id: generateId(),
      ...newTemplate,
    };
    setTemplates([...templates, template]);
    setIsCreateDialogOpen(false);
    setNewTemplate({ name: "", description: "", category: "basic", html: emailTemplates[0].html });
  }, [newTemplate, templates]);

  // Duplicar template
  const handleDuplicateTemplate = useCallback((template: EmailTemplate) => {
    const duplicated: EmailTemplate = {
      ...template,
      id: generateId(),
      name: `${template.name} (Copia)`,
    };
    setTemplates([...templates, duplicated]);
  }, [templates]);

  // Eliminar template
  const handleDeleteTemplate = useCallback((id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
    if (editingTemplate?.id === id) {
      setEditingTemplate(null);
    }
  }, [editingTemplate]);

  // Guardar edición
  const handleSaveEdit = useCallback(() => {
    if (!editingTemplate) return;
    setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? editingTemplate : t));
    setEditingTemplate(null);
  }, [editingTemplate]);

  // Insertar variable
  const insertVariable = (variable: string) => {
    if (!editingTemplate) return;
    const textarea = document.getElementById("template-editor") as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newHtml = editingTemplate.html.substring(0, start) + variable + editingTemplate.html.substring(end);
      setEditingTemplate({ ...editingTemplate, html: newHtml });
    }
  };

  // Insertar snippet
  const insertSnippet = (snippetHtml: string) => {
    if (!editingTemplate) return;
    const textarea = document.getElementById("template-editor") as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newHtml = editingTemplate.html.substring(0, start) + snippetHtml + editingTemplate.html.substring(end);
      setEditingTemplate({ ...editingTemplate, html: newHtml });
    }
  };

  // Procesar HTML para preview
  const processHtml = (html: string) => {
    let processed = html;
    processed = processed.replace(/{{nombre}}/g, "Juan Pérez");
    processed = processed.replace(/{{email}}/g, "juan@ejemplo.com");
    processed = processed.replace(/{{fecha}}/g, new Date().toLocaleDateString("es-ES"));
    processed = processed.replace(/{{hora}}/g, new Date().toLocaleTimeString("es-ES"));
    processed = processed.replace(/{{asunto}}/g, editingTemplate?.name || "Asunto");
    processed = processed.replace(/{{mes}}/g, new Date().toLocaleDateString("es-ES", { month: "long" }));
    processed = processed.replace(/{{año}}/g, new Date().getFullYear().toString());
    processed = processed.replace(/{{empresa}}/g, "EmailSent");
    return processed;
  };

  // Preview width según dispositivo
  const getPreviewWidth = () => {
    switch (previewDevice) {
      case "mobile": return "375px";
      case "tablet": return "768px";
      default: return "100%";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-primary to-primary/80 rounded-lg">
                <Layout className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900">Plantillas</h1>
            </div>
            <p className="text-slate-500 ml-11">
              Crea y gestiona templates de email profesionales
            </p>
          </div>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-slate-900 hover:bg-slate-800"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Plantilla
          </Button>
        </div>

        {editingTemplate ? (
          // Editor View
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={() => setEditingTemplate(null)}>
                  <X className="h-4 w-4 mr-2" />
                  Cerrar
                </Button>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{editingTemplate.name}</h2>
                  <p className="text-sm text-slate-500">{editingTemplate.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setEditingTemplate(null)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveEdit} className="bg-primary hover:bg-primary/90">
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </Button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Editor Panel */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                <CardHeader className="pb-4">
                  <Tabs defaultValue="editor" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="editor">
                        <Code className="h-4 w-4 mr-2" />
                        Editor
                      </TabsTrigger>
                      <TabsTrigger value="snippets">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Componentes
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="editor" className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label>Nombre</Label>
                        <Input
                          value={editingTemplate.name}
                          onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Descripción</Label>
                        <Input
                          value={editingTemplate.description}
                          onChange={(e) => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Variables Disponibles</Label>
                        <div className="flex flex-wrap gap-2">
                          {availableVariables.map((variable) => (
                            <button
                              key={variable.key}
                              onClick={() => insertVariable(variable.key)}
                              className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20 transition-colors"
                              title={variable.description}
                            >
                              {variable.key}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>HTML</Label>
                        <Textarea
                          id="template-editor"
                          value={editingTemplate.html}
                          onChange={(e) => setEditingTemplate({ ...editingTemplate, html: e.target.value })}
                          className="min-h-[400px] font-mono text-sm"
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="snippets" className="mt-4">
                      <div className="space-y-3">
                        {htmlSnippets.map((snippet, index) => (
                          <button
                            key={index}
                            onClick={() => insertSnippet(snippet.html)}
                            className="w-full text-left p-4 rounded-lg border border-slate-200 hover:border-primary/30 hover:bg-primary/10 transition-all"
                          >
                            <h4 className="font-medium text-slate-800">{snippet.name}</h4>
                            <p className="text-xs text-slate-500 mt-1 font-mono truncate">
                              {snippet.html.substring(0, 100)}...
                            </p>
                          </button>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardHeader>
              </Card>

              {/* Preview Panel */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Vista Previa</CardTitle>
                    <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                      <button
                        onClick={() => setPreviewDevice("desktop")}
                        className={`p-2 rounded ${previewDevice === "desktop" ? "bg-white shadow-sm" : ""}`}
                      >
                        <Monitor className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setPreviewDevice("tablet")}
                        className={`p-2 rounded ${previewDevice === "tablet" ? "bg-white shadow-sm" : ""}`}
                      >
                        <Tablet className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setPreviewDevice("mobile")}
                        className={`p-2 rounded ${previewDevice === "mobile" ? "bg-white shadow-sm" : ""}`}
                      >
                        <Smartphone className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-100 rounded-lg p-4 flex justify-center" style={{ minHeight: "500px" }}>
                    <div
                      style={{ width: getPreviewWidth(), transition: "width 0.3s ease" }}
                      className="bg-white rounded-lg overflow-hidden shadow-sm"
                    >
                      <iframe
                        srcDoc={processHtml(editingTemplate.html)}
                        className="w-full h-full"
                        style={{ minHeight: "500px" }}
                        sandbox="allow-scripts"
                        title="Template Preview"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          // Grid View
          <>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar plantillas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-slate-200"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === category.id
                        ? "bg-slate-900 text-white"
                        : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {category.name}
                    <span className={`ml-2 text-xs ${selectedCategory === category.id ? "text-slate-300" : "text-slate-400"}`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Templates Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((template) => (
                <Card 
                  key={template.id} 
                  className="group border-0 shadow-lg bg-white/80 backdrop-blur hover:shadow-xl transition-all cursor-pointer overflow-hidden"
                  onClick={() => setEditingTemplate(template)}
                >
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <iframe
                      srcDoc={processHtml(template.html)}
                      className="w-full h-full pointer-events-none"
                      style={{ transform: "scale(0.5)", transformOrigin: "top left", width: "200%", height: "200%" }}
                      sandbox="allow-scripts"
                      title={template.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                      <Button variant="secondary" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors">
                          {template.name}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                          {template.description}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setEditingTemplate(template); }}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDuplicateTemplate(template); }}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => { e.stopPropagation(); handleDeleteTemplate(template.id); }}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <Badge variant="secondary" className="text-xs">
                        {categories.find(c => c.id === template.category)?.name}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-16">
                <Layout className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No se encontraron plantillas</h3>
                <p className="text-slate-500 mb-4">Intenta con otra búsqueda o crea una nueva plantilla</p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Plantilla
                </Button>
              </div>
            )}
          </>
        )}

        {/* Create Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nueva Plantilla</DialogTitle>
              <DialogDescription>
                Diseña un nuevo template de email desde cero o basado en uno existente
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input
                  placeholder="Ej: Newsletter Mensual"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Descripción</Label>
                <Input
                  placeholder="Breve descripción del template..."
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Categoría</Label>
                <select
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value as EmailTemplate["category"] })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="basic">Básico</option>
                  <option value="newsletter">Newsletter</option>
                  <option value="promotional">Promocional</option>
                  <option value="welcome">Bienvenida</option>
                  <option value="transactional">Transaccional</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Basado en</Label>
                <select
                  onChange={(e) => {
                    const baseTemplate = emailTemplates.find(t => t.id === e.target.value);
                    if (baseTemplate) {
                      setNewTemplate({ ...newTemplate, html: baseTemplate.html });
                    }
                  }}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Seleccionar template base...</option>
                  {emailTemplates.map(template => (
                    <option key={template.id} value={template.id}>{template.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleCreateTemplate}
                disabled={!newTemplate.name || !newTemplate.description}
                className="bg-primary hover:bg-primary/90"
              >
                Crear Plantilla
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
