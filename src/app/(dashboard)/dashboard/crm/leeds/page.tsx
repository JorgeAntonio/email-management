'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Building2,
  Calendar,
  DollarSign,
  Filter,
  Mail,
  MoreHorizontal,
  Plus,
  Search,
} from 'lucide-react';
import { useState } from 'react';

// Tipos para el CRM
interface Deal {
  id: number;
  title: string;
  value: number;
  currency: string;
  contact: {
    name: string;
    email: string;
    company?: string;
    phone?: string;
  };
  stage: string;
  expectedCloseDate?: string;
  lastActivity?: string;
  priority: 'high' | 'medium' | 'low';
}

interface Stage {
  id: string;
  name: string;
  color: string;
  deals: Deal[];
}

// Datos mock para el pipeline
const initialStages: Stage[] = [
  {
    id: 'new',
    name: 'Nuevo',
    color: 'bg-[#E5E7EB]',
    deals: [
      {
        id: 1,
        title: 'Propuesta de software CRM',
        value: 15000,
        currency: 'USD',
        contact: {
          name: 'Carlos Rodríguez',
          email: 'carlos@empresa.com',
          company: 'Tech Solutions SA',
          phone: '+51 987 654 321',
        },
        stage: 'new',
        expectedCloseDate: '2026-03-15',
        lastActivity: 'Hace 2 horas',
        priority: 'high',
      },
      {
        id: 2,
        title: 'Implementación de email marketing',
        value: 8500,
        currency: 'USD',
        contact: {
          name: 'Ana Martínez',
          email: 'ana@startup.io',
          company: 'Startup Innovadora',
        },
        stage: 'new',
        lastActivity: 'Hace 5 horas',
        priority: 'medium',
      },
    ],
  },
  {
    id: 'qualified',
    name: 'Calificado',
    color: 'bg-[#EEF2FF]',
    deals: [
      {
        id: 3,
        title: 'Servicio de automatización',
        value: 25000,
        currency: 'USD',
        contact: {
          name: 'Pedro Sánchez',
          email: 'pedro@corp.com',
          company: 'Corporación Global',
          phone: '+51 912 345 678',
        },
        stage: 'qualified',
        expectedCloseDate: '2026-03-20',
        lastActivity: 'Ayer',
        priority: 'high',
      },
    ],
  },
  {
    id: 'proposal',
    name: 'Propuesta',
    color: 'bg-[#FEF3C7]',
    deals: [
      {
        id: 4,
        title: 'Consultoría de marketing digital',
        value: 12000,
        currency: 'USD',
        contact: {
          name: 'María García',
          email: 'maria@marketing.com',
          company: 'Marketing Pro',
        },
        stage: 'proposal',
        expectedCloseDate: '2026-02-28',
        lastActivity: 'Hace 3 días',
        priority: 'medium',
      },
      {
        id: 5,
        title: 'Licencias enterprise',
        value: 45000,
        currency: 'USD',
        contact: {
          name: 'Juan Pérez',
          email: 'juan@enterprise.com',
          company: 'Enterprise Solutions',
          phone: '+51 945 678 901',
        },
        stage: 'proposal',
        expectedCloseDate: '2026-04-01',
        lastActivity: 'Hace 1 día',
        priority: 'high',
      },
    ],
  },
  {
    id: 'negotiation',
    name: 'Negociación',
    color: 'bg-[#E6F9F0]',
    deals: [
      {
        id: 6,
        title: 'Migración de plataforma',
        value: 35000,
        currency: 'USD',
        contact: {
          name: 'Laura Torres',
          email: 'laura@techcorp.com',
          company: 'TechCorp International',
        },
        stage: 'negotiation',
        expectedCloseDate: '2026-02-20',
        lastActivity: 'Hace 4 horas',
        priority: 'high',
      },
    ],
  },
  {
    id: 'won',
    name: 'Ganado',
    color: 'bg-[#00D26A]',
    deals: [
      {
        id: 7,
        title: 'Suscripción anual',
        value: 18000,
        currency: 'USD',
        contact: {
          name: 'Diego López',
          email: 'diego@cliente.com',
          company: 'Cliente Premium SA',
        },
        stage: 'won',
        expectedCloseDate: '2026-02-10',
        lastActivity: 'Cerrado hoy',
        priority: 'medium',
      },
    ],
  },
  {
    id: 'lost',
    name: 'Perdido',
    color: 'bg-[#FEE2E2]',
    deals: [
      {
        id: 8,
        title: 'Proyecto de consultoría',
        value: 8000,
        currency: 'USD',
        contact: {
          name: 'Sofia Ruiz',
          email: 'sofia@otra.com',
          company: 'Otra Empresa',
        },
        stage: 'lost',
        lastActivity: 'Cerrado ayer',
        priority: 'low',
      },
    ],
  },
];

function DealCard({ deal }: { deal: Deal }) {
  const priorityColors = {
    high: 'bg-[#EF4444] text-white',
    medium: 'bg-[#F59E0B] text-white',
    low: 'bg-[#6B7280] text-white',
  };

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="border-[#E5E7EB] hover:shadow-md transition-shadow cursor-pointer group">
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <h4 className="font-semibold text-[#1A1A1A] text-sm line-clamp-2 flex-1">
            {deal.title}
          </h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Ver detalle</DropdownMenuItem>
              <DropdownMenuItem>Editar</DropdownMenuItem>
              <DropdownMenuItem className="text-[#EF4444]">
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Value */}
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-[#00D26A]" />
          <span className="font-bold text-[#1A1A1A]">
            {formatCurrency(deal.value, deal.currency)}
          </span>
          <Badge className={`text-xs ${priorityColors[deal.priority]}`}>
            {deal.priority === 'high'
              ? 'Alta'
              : deal.priority === 'medium'
                ? 'Media'
                : 'Baja'}
          </Badge>
        </div>

        {/* Contact */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-[#00D26A] text-white text-xs">
                {deal.contact.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1A1A1A] truncate">
                {deal.contact.name}
              </p>
            </div>
          </div>

          {deal.contact.company && (
            <div className="flex items-center gap-2 text-xs text-[#6B7280]">
              <Building2 className="h-3 w-3" />
              <span className="truncate">{deal.contact.company}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-[#6B7280]">
            <Mail className="h-3 w-3" />
            <span className="truncate">{deal.contact.email}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#6B7280]">
          {deal.expectedCloseDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Cierre: {deal.expectedCloseDate}</span>
            </div>
          )}
          <span>{deal.lastActivity}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CRMPage() {
  const [stages] = useState<Stage[]>(initialStages);
  const [searchQuery, setSearchQuery] = useState('');

  // Calcular totales
  const totalDeals = stages.reduce((acc, stage) => acc + stage.deals.length, 0);
  const totalValue = stages.reduce(
    (acc, stage) =>
      acc + stage.deals.reduce((sum, deal) => sum + deal.value, 0),
    0
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6 h-full container">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A1A]">Leeds</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Gestiona tus oportunidades y pipeline de ventas
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="gap-2 border-[#E5E7EB] text-[#1A1A1A]"
          >
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
          <Button className="gap-2 bg-[#00D26A] hover:bg-[#00B85C]">
            <Plus className="h-4 w-4" />
            Nueva oportunidad
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 container">
        <Card className="border-[#E5E7EB]">
          <CardContent className="p-4">
            <p className="text-sm text-[#6B7280]">Total oportunidades</p>
            <p className="text-2xl font-bold text-[#1A1A1A]">{totalDeals}</p>
          </CardContent>
        </Card>
        <Card className="border-[#E5E7EB]">
          <CardContent className="p-4">
            <p className="text-sm text-[#6B7280]">Valor total</p>
            <p className="text-2xl font-bold text-[#1A1A1A]">
              {formatCurrency(totalValue)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-[#E5E7EB]">
          <CardContent className="p-4">
            <p className="text-sm text-[#6B7280]">Ganadas este mes</p>
            <p className="text-2xl font-bold text-[#00D26A]">$18,000</p>
          </CardContent>
        </Card>
        <Card className="border-[#E5E7EB]">
          <CardContent className="p-4">
            <p className="text-sm text-[#6B7280]">Tasa de conversión</p>
            <p className="text-2xl font-bold text-[#1A1A1A]">25%</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 container">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
          <Input
            placeholder="Buscar oportunidades..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-[#E5E7EB]"
          />
        </div>
      </div>

      {/* Pipeline */}
      <div className="flex gap-4 overflow-x-auto pb-4 container">
        {stages.map((stage) => (
          <div key={stage.id} className="flex-shrink-0 w-80">
            {/* Stage Header */}
            <div className={`${stage.color} rounded-t-lg p-3`}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[#1A1A1A]">{stage.name}</h3>
                <Badge variant="secondary" className="bg-white/80">
                  {stage.deals.length}
                </Badge>
              </div>
              <p className="text-xs text-[#6B7280] mt-1">
                {formatCurrency(
                  stage.deals.reduce((sum, deal) => sum + deal.value, 0)
                )}
              </p>
            </div>

            {/* Stage Content */}
            <div className="bg-[#F9FAFB] rounded-b-lg p-3 space-y-3 min-h-[200px]">
              <ScrollArea className="h-[calc(100vh-400px)]">
                <div className="space-y-3 pr-3">
                  {stage.deals.map((deal) => (
                    <DealCard key={deal.id} deal={deal} />
                  ))}

                  {stage.deals.length === 0 && (
                    <div className="text-center py-8 text-[#9CA3AF] text-sm">
                      No hay oportunidades
                    </div>
                  )}

                  {/* Add Deal Button */}
                  <Button
                    variant="ghost"
                    className="w-full border-2 border-dashed border-[#E5E7EB] hover:border-[#00D26A] hover:text-[#00D26A]"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Añadir oportunidad
                  </Button>
                </div>
              </ScrollArea>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
