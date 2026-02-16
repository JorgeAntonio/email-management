"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Mail,
  MessageSquare,
  Phone,
  Bell,
  Crown,
  ChevronRight,
} from "lucide-react";

const campaignTypes = [
  {
    id: "email",
    title: "Email",
    description: "Crea y envía campañas de email profesionales",
    icon: Mail,
    color: "bg-[#E6F9F0]",
    iconColor: "text-[#00D26A]",
    borderColor: "border-[#00D26A]",
    premium: false,
  },
  {
    id: "sms",
    title: "SMS",
    description: "Envía mensajes de texto a tus contactos",
    icon: MessageSquare,
    color: "bg-[#EEF2FF]",
    iconColor: "text-[#6366F1]",
    borderColor: "border-[#6366F1]",
    premium: false,
  },
  {
    id: "whatsapp",
    title: "WhatsApp",
    description: "Conecta con tus clientes por WhatsApp",
    icon: Phone,
    color: "bg-[#FEF3C7]",
    iconColor: "text-[#F59E0B]",
    borderColor: "border-[#F59E0B]",
    premium: true,
  },
  {
    id: "push",
    title: "Push",
    description: "Envía notificaciones push a tus usuarios",
    icon: Bell,
    color: "bg-[#FCE7F3]",
    iconColor: "text-[#EC4899]",
    borderColor: "border-[#EC4899]",
    premium: true,
  },
];

export default function CampaignsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1A1A1A]">Campañas</h1>
      </div>

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto py-8">
        <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-4">
          Tus clientes nunca han estado tan cerca
        </h2>
        <p className="text-[#6B7280] mb-2">
          No importa cómo quieras llegar a tus clientes, tenemos el canal de marketing adecuado para ti.
        </p>
        <p className="text-[#1A1A1A] font-medium">
          ¿Qué tipo de campaña quieres crear?
        </p>
      </div>

      {/* Campaign Type Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {campaignTypes.map((type) => {
          const Icon = type.icon;
          return (
            <Card
              key={type.id}
              className={`group cursor-pointer border-2 border-transparent hover:${type.borderColor} transition-all duration-200 hover:shadow-lg`}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  {/* Icon Container */}
                  <div
                    className={`w-20 h-20 ${type.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
                  >
                    <Icon className={`h-10 w-10 ${type.iconColor}`} />
                  </div>

                  {/* Title */}
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-[#1A1A1A]">
                      {type.title}
                    </h3>
                    {type.premium && (
                      <Crown className="h-4 w-4 text-[#FBBF24]" />
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-[#6B7280] mb-4">
                    {type.description}
                  </p>

                  {/* Action Button */}
                  <Button
                    variant="ghost"
                    className={`gap-1 ${type.iconColor} hover:${type.color}`}
                  >
                    Crear campaña
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Campaigns Section */}
      <div className="pt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[#1A1A1A]">
            Campañas recientes
          </h2>
          <Button variant="link" className="text-[#6366F1]">
            Ver todas
          </Button>
        </div>

        <Card className="border-[#E5E7EB]">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center text-center">
              {/* Empty state illustration */}
              <div className="relative mb-6">
                <svg
                  width="200"
                  height="150"
                  viewBox="0 0 200 150"
                  fill="none"
                  className="mx-auto"
                >
                  {/* Background */}
                  <ellipse
                    cx="100"
                    cy="120"
                    rx="80"
                    ry="20"
                    fill="#E6F9F0"
                  />
                  
                  {/* Envelope */}
                  <rect
                    x="60"
                    y="50"
                    width="80"
                    height="60"
                    rx="4"
                    fill="#00D26A"
                    opacity="0.3"
                  />
                  <path
                    d="M60 55 L100 85 L140 55"
                    stroke="#00D26A"
                    strokeWidth="3"
                    fill="none"
                  />
                  <path
                    d="M60 110 L85 85"
                    stroke="#00D26A"
                    strokeWidth="2"
                    opacity="0.5"
                  />
                  <path
                    d="M140 110 L115 85"
                    stroke="#00D26A"
                    strokeWidth="2"
                    opacity="0.5"
                  />
                  
                  {/* Decorative elements */}
                  <circle cx="40" cy="60" r="4" fill="#00D26A" opacity="0.4" />
                  <circle cx="160" cy="50" r="3" fill="#00D26A" opacity="0.3" />
                  <circle cx="45" cy="100" r="2" fill="#00D26A" opacity="0.5" />
                  
                  {/* Stars/sparkles */}
                  <path
                    d="M165 75 L167 80 L172 82 L167 84 L165 89 L163 84 L158 82 L163 80 Z"
                    fill="#00D26A"
                    opacity="0.6"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
                Aún no has creado ninguna campaña
              </h3>
              <p className="text-sm text-[#6B7280] max-w-md mb-6">
                Crea tu primera campaña para comenzar a conectar con tus contactos. 
                Elige el canal que prefieras: Email, SMS, WhatsApp o notificaciones Push.
              </p>
              <Button className="gap-2 bg-[#00D26A] hover:bg-[#00B85C]">
                <Mail className="h-4 w-4" />
                Crear primera campaña
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tips Section */}
      <div className="grid gap-6 md:grid-cols-3 pt-8">
        <Card className="border-[#E5E7EB]">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-[#E6F9F0] flex items-center justify-center flex-shrink-0">
                <Mail className="h-5 w-5 text-[#00D26A]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#1A1A1A] mb-1">
                  Email Marketing
                </h4>
                <p className="text-sm text-[#6B7280]">
                  El canal más efectivo para nutrir leads y fidelizar clientes. 
                  Alcanza hasta un 4400% de ROI.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E5E7EB]">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-[#EEF2FF] flex items-center justify-center flex-shrink-0">
                <MessageSquare className="h-5 w-5 text-[#6366F1]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#1A1A1A] mb-1">
                  SMS Marketing
                </h4>
                <p className="text-sm text-[#6B7280]">
                  Mensajes directos con alta tasa de apertura (98%). 
                  Ideal para ofertas urgentes y recordatorios.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E5E7EB]">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-[#FEF3C7] flex items-center justify-center flex-shrink-0">
                <Phone className="h-5 w-5 text-[#F59E0B]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#1A1A1A] mb-1">
                  WhatsApp Business
                </h4>
                <p className="text-sm text-[#6B7280]">
                  Conecta con tus clientes en su app favorita. 
                  Mensajes personalizados con alta engagement.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
