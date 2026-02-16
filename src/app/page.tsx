"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "react-calendar";
import { ChevronLeft, ChevronRight, Users, Mail, MessageSquare, Crown, ArrowRight, Settings, Sparkles } from "lucide-react";
import "react-calendar/dist/Calendar.css";

export default function DashboardPage() {
  const [date, setDate] = useState(new Date());

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#1A1A1A]">
          Hola, Jorge Antonio
        </h1>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 text-[#6366F1] border-[#6366F1]">
            <Settings className="h-4 w-4" />
            Personalizar página
          </Button>
          <Button className="gap-2 bg-[#1A1A1A] hover:bg-[#374151]">
            <Crown className="h-4 w-4" />
            Actualizar ahora
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar Widget */}
        <Card className="border-[#E5E7EB]">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium text-[#1A1A1A]">
                febrero 2026
              </span>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Calendar
              onChange={(value) => setDate(value as Date)}
              value={date}
              className="border-0 shadow-none w-full"
              tileClassName={({ date: tileDate }) => {
                const day = tileDate.getDate();
                if (day === 16) {
                  return "bg-[#00D26A] text-white rounded-full";
                }
                return "";
              }}
            />
          </CardContent>
        </Card>

        {/* Onboarding Steps */}
        <Card className="lg:col-span-2 border-[#E5E7EB]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-[#1A1A1A]">
                Primeros pasos con Brevo
              </CardTitle>
              <Button className="bg-[#1A1A1A] hover:bg-[#374151]">
                Crear campaña
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 rounded-lg bg-[#E6F9F0] flex items-center justify-center">
                    <span className="text-3xl font-bold text-[#00D26A]">1</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#1A1A1A] mb-2">
                    Añade tus primeros contactos
                  </h3>
                  <p className="text-sm text-[#6B7280] mb-4">
                    Necesitas contactos para crear una campaña. Crea tu base de datos de contactos o añade el destinatario de tu primera campaña.
                  </p>
                  <Button variant="link" className="p-0 h-auto text-[#6366F1] font-medium">
                    Importa tus contactos
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 rounded-lg bg-[#E6F9F0] flex items-center justify-center">
                    <span className="text-3xl font-bold text-[#00D26A]">2</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#1A1A1A] mb-2">
                    Crea tu primera campaña
                  </h3>
                  <p className="text-sm text-[#6B7280] mb-4">
                    Es hora de ser creativos y elaborar una campaña. ¿Necesitas inspiración? Elige una plantilla de email y utiliza nuestro asistente de redacción de IA.
                  </p>
                  <Button variant="link" className="p-0 h-auto text-[#6366F1] font-medium">
                    Crear tu primera campaña
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Organize Contacts Card */}
        <Card className="border-[#E5E7EB]">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-20 w-20 rounded-lg bg-[#E6F9F0] flex items-center justify-center">
                  <Users className="h-10 w-10 text-[#00D26A]" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[#1A1A1A] mb-2">
                  Organiza tus contactos para personalizar los mensajes
                </h3>
                <p className="text-sm text-[#6B7280] mb-4">
                  Con segmentación y listas, crea campañas altamente segmentadas basadas en el comportamiento o la demografía de tus clientes.
                </p>
                <Button className="bg-[#1A1A1A] hover:bg-[#374151]">
                  Añadir contactos
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plan Usage Card */}
        <Card className="lg:col-span-2 border-[#E5E7EB]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#1A1A1A]">
              Uso de tu plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Emails */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#6B7280]" />
                  <span className="text-sm font-medium text-[#1A1A1A]">Emails</span>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Settings className="h-4 w-4 text-[#6366F1]" />
                </Button>
              </div>
              <Progress value={0} className="h-2" />
              <p className="text-sm text-[#6B7280]">
                <span className="font-medium text-[#1A1A1A]">300</span> restantes de 300 hasta 16/02/2026
              </p>
            </div>

            {/* Prepaid Credits */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#6B7280]" />
                  <span className="text-sm font-medium text-[#1A1A1A]">Créditos de prepago</span>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Settings className="h-4 w-4 text-[#6366F1]" />
                </Button>
              </div>
              <p className="text-sm text-[#6B7280]">
                <span className="font-medium text-[#1A1A1A]">0</span> créditos restantes
              </p>
            </div>

            {/* SMS */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-[#6B7280]" />
                  <span className="text-sm font-medium text-[#1A1A1A]">SMS</span>
                </div>
              </div>
              <p className="text-sm text-[#6B7280]">
                <span className="font-medium text-[#1A1A1A]">0</span> créditos restantes
              </p>
            </div>

            <Button variant="link" className="p-0 h-auto text-[#6366F1] font-medium">
              Gestionar tu plan
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Communication Card */}
      <Card className="border-[#E5E7EB]">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="h-20 w-20 rounded-lg bg-[#E6F9F0] flex items-center justify-center">
                <MessageSquare className="h-10 w-10 text-[#00D26A]" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[#1A1A1A] mb-2">
                Conversa con tus clientes en su canal de comunicación preferido
              </h3>
              <p className="text-sm text-[#6B7280]">
                Amplía tu alcance y acerca a tus contactos a la compra con campañas multicanal: email, SMS, WhatsApp y notificaciones push.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
