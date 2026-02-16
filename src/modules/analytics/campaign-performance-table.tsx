"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  MousePointer,
  Send,
  AlertCircle,
} from "lucide-react";

interface Campaign {
  id: number;
  name: string;
  subject: string;
  sentDate: string;
  status: "sent" | "sending" | "scheduled" | "draft";
  recipients: number;
  opens: number;
  clicks: number;
  bounces: number;
  unsubscribes: number;
}

const campaigns: Campaign[] = [
  {
    id: 1,
    name: "Newsletter Febrero 2026",
    subject: "Descubre nuestras novedades de este mes",
    sentDate: "16/02/2026",
    status: "sent",
    recipients: 5280,
    opens: 3896,
    clicks: 892,
    bounces: 42,
    unsubscribes: 8,
  },
  {
    id: 2,
    name: "Promoción de Verano",
    subject: "50% de descuento en todos nuestros servicios",
    sentDate: "14/02/2026",
    status: "sent",
    recipients: 8150,
    opens: 5420,
    clicks: 1850,
    bounces: 85,
    unsubscribes: 22,
  },
  {
    id: 3,
    name: "Bienvenida Nuevos Suscriptores",
    subject: "¡Bienvenido a nuestra comunidad!",
    sentDate: "12/02/2026",
    status: "sent",
    recipients: 420,
    opens: 380,
    clicks: 95,
    bounces: 5,
    unsubscribes: 1,
  },
  {
    id: 4,
    name: "Recordatorio de Evento",
    subject: "No olvides nuestro webinar mañana",
    sentDate: "10/02/2026",
    status: "sent",
    recipients: 3250,
    opens: 2150,
    clicks: 420,
    bounces: 28,
    unsubscribes: 5,
  },
  {
    id: 5,
    name: "Actualización de Producto",
    subject: "Nuevas funcionalidades disponibles",
    sentDate: "08/02/2026",
    status: "sent",
    recipients: 6800,
    opens: 4420,
    clicks: 980,
    bounces: 68,
    unsubscribes: 15,
  },
];

const getStatusBadge = (status: Campaign["status"]) => {
  const statusConfig = {
    sent: { label: "Enviada", className: "bg-[#E6F9F0] text-[#00D26A] hover:bg-[#E6F9F0]" },
    sending: { label: "Enviando", className: "bg-[#FEF3C7] text-[#F59E0B] hover:bg-[#FEF3C7]" },
    scheduled: { label: "Programada", className: "bg-[#EEF2FF] text-[#6366F1] hover:bg-[#EEF2FF]" },
    draft: { label: "Borrador", className: "bg-[#F3F4F6] text-[#6B7280] hover:bg-[#F3F4F6]" },
  };

  const config = statusConfig[status];
  return <Badge className={config.className}>{config.label}</Badge>;
};

export function CampaignPerformanceTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Calcular tasas
  const calculateRate = (value: number, total: number) => {
    return ((value / total) * 100).toFixed(1);
  };

  return (
    <Card className="border-[#E5E7EB]">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-[#1A1A1A]">
            Rendimiento por campaña
          </CardTitle>
          <div className="flex items-center gap-4">
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px] border-[#E5E7EB]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="sent">Enviadas</SelectItem>
                <SelectItem value="sending">Enviando</SelectItem>
                <SelectItem value="scheduled">Programadas</SelectItem>
                <SelectItem value="draft">Borradores</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#E5E7EB] hover:bg-transparent">
              <TableHead className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                Campaña
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider w-[120px]">
                Estado
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider w-[100px] text-right">
                Enviados
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider w-[120px]">
                Aperturas
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider w-[120px]">
                Clics
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider w-[100px]">
                Rebotes
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider w-[80px]">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => {
              const openRate = calculateRate(campaign.opens, campaign.recipients);
              const clickRate = calculateRate(campaign.clicks, campaign.recipients);
              const bounceRate = calculateRate(campaign.bounces, campaign.recipients);

              return (
                <TableRow
                  key={campaign.id}
                  className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB]"
                >
                  <TableCell>
                    <div>
                      <p className="font-medium text-[#1A1A1A]">{campaign.name}</p>
                      <p className="text-xs text-[#6B7280] truncate max-w-[250px]">
                        {campaign.subject}
                      </p>
                      <p className="text-xs text-[#9CA3AF] mt-1">
                        {campaign.sentDate}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Send className="h-4 w-4 text-[#6B7280]" />
                      <span className="font-medium text-[#1A1A1A]">
                        {campaign.recipients.toLocaleString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-[#6366F1]" />
                          <span className="font-medium text-[#1A1A1A]">
                            {campaign.opens.toLocaleString()}
                          </span>
                        </div>
                        <span className="text-sm text-[#00D26A] font-medium">
                          {openRate}%
                        </span>
                      </div>
                      <Progress
                        value={Number(openRate)}
                        className="h-1.5"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MousePointer className="h-4 w-4 text-[#F59E0B]" />
                          <span className="font-medium text-[#1A1A1A]">
                            {campaign.clicks.toLocaleString()}
                          </span>
                        </div>
                        <span className="text-sm text-[#F59E0B] font-medium">
                          {clickRate}%
                        </span>
                      </div>
                      <Progress
                        value={Number(clickRate)}
                        className="h-1.5"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <AlertCircle
                        className={`h-4 w-4 ${
                          Number(bounceRate) > 5
                            ? "text-[#EF4444]"
                            : "text-[#6B7280]"
                        }`}
                      />
                      <div>
                        <span className="font-medium text-[#1A1A1A]">
                          {campaign.bounces.toLocaleString()}
                        </span>
                        <span
                          className={`text-xs ml-1 ${
                            Number(bounceRate) > 5
                              ? "text-[#EF4444]"
                              : "text-[#6B7280]"
                          }`}
                        >
                          ({bounceRate}%)
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4 text-[#6B7280]" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Ver reporte detallado</DropdownMenuItem>
                        <DropdownMenuItem>Duplicar campaña</DropdownMenuItem>
                        <DropdownMenuItem>Exportar datos</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E7EB]">
          <div className="flex items-center gap-4">
            <Select
              value={rowsPerPage.toString()}
              onValueChange={(value) => setRowsPerPage(Number(value))}
            >
              <SelectTrigger className="w-[80px] border-[#E5E7EB]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-[#6B7280]">Filas por página</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-[#6B7280]">
              1-{Math.min(rowsPerPage, campaigns.length)} de {campaigns.length}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-[#E5E7EB]"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 min-w-[32px] border-[#E5E7EB] bg-[#F3F4F6]"
              >
                {currentPage}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-[#E5E7EB]"
                disabled={currentPage * rowsPerPage >= campaigns.length}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
