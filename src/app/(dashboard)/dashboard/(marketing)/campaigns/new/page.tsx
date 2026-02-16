"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Settings,
  Palette,
  Users,
  Send,
  Clock,
  Save,
  Image as ImageIcon,
} from "lucide-react";

// Plantillas de email predefinidas
const emailTemplates = [
  {
    id: 1,
    name: "Bienvenida",
    description: "Perfecta para nuevos suscriptores",
    thumbnail: "bg-[#E6F9F0]",
    category: "Onboarding",
  },
  {
    id: 2,
    name: "Newsletter",
    description: "Diseño limpio para newsletters",
    thumbnail: "bg-[#EEF2FF]",
    category: "Marketing",
  },
  {
    id: 3,
    name: "Promoción",
    description: "Destaca tus ofertas especiales",
    thumbnail: "bg-[#FEF3C7]",
    category: "Ventas",
  },
  {
    id: 4,
    name: "Recordatorio",
    description: "Simple y directo",
    thumbnail: "bg-[#FCE7F3]",
    category: "Transaccional",
  },
  {
    id: 5,
    name: "Evento",
    description: "Invitaciones y confirmaciones",
    thumbnail: "bg-[#E0F2FE]",
    category: "Eventos",
  },
  {
    id: 6,
    name: "En blanco",
    description: "Comienza desde cero",
    thumbnail: "bg-white border-2 border-dashed border-[#E5E7EB]",
    category: "General",
  },
];

// Listas y segmentos disponibles
const availableLists = [
  { id: "all", name: "Todos los contactos", count: 1245 },
  { id: "subscribers", name: "Suscriptores activos", count: 980 },
  { id: "customers", name: "Clientes", count: 450 },
  { id: "leads", name: "Leads cualificados", count: 320 },
];

const availableSegments = [
  { id: "engaged", name: "Altamente comprometidos", count: 520 },
  { id: "recent", name: "Contactos recientes", count: 180 },
  { id: "inactive", name: "Inactivos 30 días", count: 245 },
];

// Componente del Editor Simple
function SimpleEditor({ content, onChange }: { content: string; onChange: (value: string) => void }) {
  const [activeTab, setActiveTab] = useState("edit");

  const insertVariable = (variable: string) => {
    onChange(content + ` {{${variable}}}`);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
        <span className="text-sm text-[#6B7280] mr-2">Variables:</span>
        {["nombre", "email", "empresa", "fecha"].map((variable) => (
          <Button
            key={variable}
            variant="outline"
            size="sm"
            onClick={() => insertVariable(variable)}
            className="text-xs capitalize"
          >
            {variable}
          </Button>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit">Editar</TabsTrigger>
          <TabsTrigger value="preview">Vista previa</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="mt-4">
          <Textarea
            value={content}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-[400px] font-mono text-sm"
            placeholder="Escribe el contenido de tu email aquí..."
          />
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <div className="border border-[#E5E7EB] rounded-lg p-6 min-h-[400px] bg-white">
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: content
                  .replace(/\n/g, "<br/>")
                  .replace(/{{nombre}}/g, "<strong>Juan</strong>")
                  .replace(/{{email}}/g, "<strong>juan@ejemplo.com</strong>")
                  .replace(/{{empresa}}/g, "<strong>Tu Empresa</strong>")
                  .replace(/{{fecha}}/g, "<strong>16/02/2026</strong>"),
              }}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function NewCampaignPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [campaignData, setCampaignData] = useState({
    name: "",
    subject: "",
    preheader: "",
    sender: "jorge@brevo.com",
    replyTo: "",
    selectedTemplate: null as number | null,
    content: `Hola {{nombre}},

Gracias por ser parte de nuestra comunidad. Queremos compartir contigo las últimas novedades y ofertas especiales.

Saludos cordiales,
El equipo de Brevo`,
    selectedLists: [] as string[],
    selectedSegments: [] as string[],
    scheduling: "now" as "now" | "later",
    scheduledDate: "",
    scheduledTime: "",
  });

  const updateCampaignData = (field: string, value: string | number | string[] | null) => {
    setCampaignData((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return campaignData.name && campaignData.subject;
      case 2:
        return campaignData.selectedTemplate !== null && campaignData.content;
      case 3:
        return (
          (campaignData.selectedLists.length > 0 ||
            campaignData.selectedSegments.length > 0) &&
          (campaignData.scheduling === "now" ||
            (campaignData.scheduling === "later" &&
              campaignData.scheduledDate &&
              campaignData.scheduledTime))
        );
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = () => {
    alert("Campaña guardada como borrador");
  };

  const handleSend = () => {
    const recipientCount =
      campaignData.selectedLists.length +
      campaignData.selectedSegments.length;
    alert(
      `Campaña ${campaignData.scheduling === "now" ? "enviada" : "programada"} exitosamente a ${recipientCount} destinatarios`
    );
  };

  const steps = [
    { id: 1, title: "Configuración", icon: Settings },
    { id: 2, title: "Diseño", icon: Palette },
    { id: 3, title: "Destinatarios", icon: Users },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A1A]">Crear campaña</h1>
            <p className="text-sm text-[#6B7280]">
              Paso {currentStep} de 3: {steps[currentStep - 1].title}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSaveDraft}>
            <Save className="mr-2 h-4 w-4" />
            Guardar borrador
          </Button>
          {currentStep === 3 && (
            <Button
              onClick={handleSend}
              disabled={!canProceed()}
              className="bg-[#00D26A] hover:bg-[#00B85C]"
            >
              <Send className="mr-2 h-4 w-4" />
              {campaignData.scheduling === "now"
                ? "Enviar ahora"
                : "Programar envío"}
            </Button>
          )}
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                  isActive
                    ? "bg-[#E6F9F0] text-[#00D26A]"
                    : isCompleted
                    ? "bg-[#E6F9F0] text-[#00D26A]"
                    : "bg-[#F3F4F6] text-[#6B7280]"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isActive
                      ? "bg-[#00D26A] text-white"
                      : isCompleted
                      ? "bg-[#00D26A] text-white"
                      : "bg-[#E5E7EB] text-[#6B7280]"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <span className="font-medium hidden sm:inline">{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-4 ${
                    isCompleted ? "bg-[#00D26A]" : "bg-[#E5E7EB]"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <Card className="border-[#E5E7EB]">
        <CardContent className="p-6">
          {/* Step 1: Configuration */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">
                  Configuración básica
                </h2>
                <p className="text-sm text-[#6B7280] mb-6">
                  Define los detalles principales de tu campaña de email.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-name">
                    Nombre de la campaña <span className="text-[#EF4444]">*</span>
                  </Label>
                  <Input
                    id="campaign-name"
                    placeholder="Ej: Newsletter Febrero 2026"
                    value={campaignData.name}
                    onChange={(e) => updateCampaignData("name", e.target.value)}
                    className="border-[#E5E7EB]"
                  />
                  <p className="text-xs text-[#6B7280]">
                    Este nombre es solo para tu referencia interna.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">
                    Asunto <span className="text-[#EF4444]">*</span>
                  </Label>
                  <Input
                    id="subject"
                    placeholder="Ej: Descubre nuestras ofertas de febrero"
                    value={campaignData.subject}
                    onChange={(e) => updateCampaignData("subject", e.target.value)}
                    className="border-[#E5E7EB]"
                  />
                  <div className="flex justify-between text-xs">
                    <span className="text-[#6B7280]">
                      Usa variables como {"{{nombre}}"} para personalizar
                    </span>
                    <span
                      className={
                        campaignData.subject.length > 50
                          ? "text-[#EF4444]"
                          : "text-[#6B7280]"
                      }
                    >
                      {campaignData.subject.length}/100 caracteres
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preheader">Preheader (opcional)</Label>
                  <Input
                    id="preheader"
                    placeholder="Texto que aparece después del asunto en la bandeja de entrada"
                    value={campaignData.preheader}
                    onChange={(e) => updateCampaignData("preheader", e.target.value)}
                    className="border-[#E5E7EB]"
                  />
                  <p className="text-xs text-[#6B7280]">
                    Añade contexto adicional para aumentar la tasa de apertura.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sender">Remitente</Label>
                    <Select
                      value={campaignData.sender}
                      onValueChange={(value) =>
                        updateCampaignData("sender", value)
                      }
                    >
                      <SelectTrigger className="border-[#E5E7EB]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jorge@brevo.com">
                          Jorge &lt;jorge@brevo.com&gt;
                        </SelectItem>
                        <SelectItem value="hola@empresa.com">
                          Equipo &lt;hola@empresa.com&gt;
                        </SelectItem>
                        <SelectItem value="noreply@empresa.com">
                          No Reply &lt;noreply@empresa.com&gt;
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reply-to">Responder a (opcional)</Label>
                    <Input
                      id="reply-to"
                      placeholder="soporte@empresa.com"
                      value={campaignData.replyTo}
                      onChange={(e) =>
                        updateCampaignData("replyTo", e.target.value)
                      }
                      className="border-[#E5E7EB]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Design */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">
                  Diseña tu email
                </h2>
                <p className="text-sm text-[#6B7280] mb-6">
                  Elige una plantilla o crea tu contenido desde cero.
                </p>
              </div>

              {/* Template Selection */}
              <div className="space-y-4">
                <Label>Selecciona una plantilla</Label>
                <div className="grid grid-cols-3 gap-4">
                  {emailTemplates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() =>
                        updateCampaignData("selectedTemplate", template.id)
                      }
                      className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                        campaignData.selectedTemplate === template.id
                          ? "border-[#00D26A] bg-[#E6F9F0]"
                          : "border-[#E5E7EB] hover:border-[#00D26A]"
                      }`}
                    >
                      <div
                        className={`h-24 rounded-md mb-3 ${template.thumbnail}`}
                      />
                      <h4 className="font-medium text-[#1A1A1A]">
                        {template.name}
                      </h4>
                      <p className="text-xs text-[#6B7280]">
                        {template.description}
                      </p>
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {template.category}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Editor */}
              <div className="space-y-4 pt-6 border-t border-[#E5E7EB]">
                <Label>Contenido del email</Label>
                <SimpleEditor
                  content={campaignData.content}
                  onChange={(value) => updateCampaignData("content", value)}
                />
              </div>

              {/* Attachments */}
              <div className="pt-6 border-t border-[#E5E7EB]">
                <Button variant="outline" className="gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Añadir imagen
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Recipients */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">
                  Selecciona los destinatarios
                </h2>
                <p className="text-sm text-[#6B7280] mb-6">
                  Elige a quién quieres enviar esta campaña.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                {/* Lists */}
                <div className="space-y-4">
                  <h3 className="font-medium text-[#1A1A1A]">Listas</h3>
                  <div className="space-y-2">
                    {availableLists.map((list) => (
                      <div
                        key={list.id}
                        className="flex items-center space-x-3 p-3 rounded-lg border border-[#E5E7EB] hover:bg-[#F9FAFB]"
                      >
                        <Checkbox
                          checked={campaignData.selectedLists.includes(list.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateCampaignData("selectedLists", [
                                ...campaignData.selectedLists,
                                list.id,
                              ]);
                            } else {
                              updateCampaignData(
                                "selectedLists",
                                campaignData.selectedLists.filter(
                                  (id) => id !== list.id
                                )
                              );
                            }
                          }}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-[#1A1A1A]">
                            {list.name}
                          </p>
                          <p className="text-xs text-[#6B7280]">
                            {list.count} contactos
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Segments */}
                <div className="space-y-4">
                  <h3 className="font-medium text-[#1A1A1A]">Segmentos</h3>
                  <div className="space-y-2">
                    {availableSegments.map((segment) => (
                      <div
                        key={segment.id}
                        className="flex items-center space-x-3 p-3 rounded-lg border border-[#E5E7EB] hover:bg-[#F9FAFB]"
                      >
                        <Checkbox
                          checked={campaignData.selectedSegments.includes(
                            segment.id
                          )}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateCampaignData("selectedSegments", [
                                ...campaignData.selectedSegments,
                                segment.id,
                              ]);
                            } else {
                              updateCampaignData(
                                "selectedSegments",
                                campaignData.selectedSegments.filter(
                                  (id) => id !== segment.id
                                )
                              );
                            }
                          }}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-[#1A1A1A]">
                            {segment.name}
                          </p>
                          <p className="text-xs text-[#6B7280]">
                            {segment.count} contactos
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 bg-[#F9FAFB] rounded-lg">
                <h4 className="font-medium text-[#1A1A1A] mb-2">Resumen</h4>
                <div className="flex gap-4 text-sm">
                  <span className="text-[#6B7280]">
                    <strong className="text-[#1A1A1A]">
                      {campaignData.selectedLists.length +
                        campaignData.selectedSegments.length}
                    </strong>{" "}
                    grupos seleccionados
                  </span>
                  <span className="text-[#6B7280]">•</span>
                  <span className="text-[#6B7280]">
                    Aproximadamente{" "}
                    <strong className="text-[#1A1A1A]">
                      {campaignData.selectedLists.reduce(
                        (acc, id) =>
                          acc +
                          (availableLists.find((l) => l.id === id)?.count || 0),
                        0
                      ) +
                        campaignData.selectedSegments.reduce(
                          (acc, id) =>
                          acc +
                            (availableSegments.find((s) => s.id === id)?.count ||
                              0),
                          0
                        )}
                    </strong>{" "}
                    contactos
                  </span>
                </div>
              </div>

              {/* Scheduling */}
              <div className="space-y-4 pt-6 border-t border-[#E5E7EB]">
                <h3 className="font-medium text-[#1A1A1A]">Programación</h3>

                <div className="space-y-3">
                  <div
                    className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer ${
                      campaignData.scheduling === "now"
                        ? "border-[#00D26A] bg-[#E6F9F0]"
                        : "border-[#E5E7EB]"
                    }`}
                    onClick={() => updateCampaignData("scheduling", "now")}
                  >
                    <Send className="h-5 w-5 text-[#00D26A]" />
                    <div className="flex-1">
                      <p className="font-medium text-[#1A1A1A]">Enviar ahora</p>
                      <p className="text-xs text-[#6B7280]">
                        La campaña se enviará inmediatamente
                      </p>
                    </div>
                    {campaignData.scheduling === "now" && (
                      <Check className="h-5 w-5 text-[#00D26A]" />
                    )}
                  </div>

                  <div
                    className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer ${
                      campaignData.scheduling === "later"
                        ? "border-[#00D26A] bg-[#E6F9F0]"
                        : "border-[#E5E7EB]"
                    }`}
                    onClick={() => updateCampaignData("scheduling", "later")}
                  >
                    <Clock className="h-5 w-5 text-[#6366F1]" />
                    <div className="flex-1">
                      <p className="font-medium text-[#1A1A1A]">
                        Programar para más tarde
                      </p>
                      <p className="text-xs text-[#6B7280]">
                        Elige la fecha y hora de envío
                      </p>
                    </div>
                    {campaignData.scheduling === "later" && (
                      <Check className="h-5 w-5 text-[#00D26A]" />
                    )}
                  </div>

                  {campaignData.scheduling === "later" && (
                    <div className="grid grid-cols-2 gap-4 ml-8">
                      <div className="space-y-2">
                        <Label>Fecha</Label>
                        <Input
                          type="date"
                          value={campaignData.scheduledDate}
                          onChange={(e) =>
                            updateCampaignData("scheduledDate", e.target.value)
                          }
                          className="border-[#E5E7EB]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Hora</Label>
                        <Input
                          type="time"
                          value={campaignData.scheduledTime}
                          onChange={(e) =>
                            updateCampaignData("scheduledTime", e.target.value)
                          }
                          className="border-[#E5E7EB]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Anterior
        </Button>

        {currentStep < 3 ? (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-[#00D26A] hover:bg-[#00B85C]"
          >
            Siguiente
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}
