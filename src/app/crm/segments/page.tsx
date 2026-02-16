"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  FolderOpen,
  MoreHorizontal,
  PieChart,
  ExternalLink,
  Pencil,
  Trash2,
  ArrowUpDown,
} from "lucide-react";

interface Segment {
  id: string;
  name: string;
  folder?: string;
  contactCount: number;
  updatedAt?: string;
}

// Mock data para segmentos (vacio para mostrar estado vacio)
const segments: Segment[] = [];

export default function SegmentsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A1A]">Segmentos</h1>
          <p className="text-sm text-[#6B7280] mt-2 max-w-2xl">
            Aquí es donde organizas tus segmentos. Crea, modifica y gestiona segmentos para interacciones específicas y guárdalos en carpetas para facilitar la navegación.
          </p>
          <div className="flex gap-4 mt-3">
            <Button
              variant="link"
              className="p-0 h-auto text-[#6366F1] font-medium text-sm"
            >
              Comprender los filtros y la segmentación
              <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
            <Button
              variant="link"
              className="p-0 h-auto text-[#6366F1] font-medium text-sm"
            >
              Diferencias entre listas y segmentos
              <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
        <Button className="gap-2 bg-[#1A1A1A] hover:bg-[#374151]">
          <Plus className="h-4 w-4" />
          Crear un segmento
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
          <Input
            placeholder="Buscar un nombre o Id. de segmento"
            className="pl-10 border-[#E5E7EB]"
          />
        </div>

        <Select>
          <SelectTrigger className="w-[220px] border-[#E5E7EB]">
            <SelectValue placeholder="Todas las carpetas (0 segmentos)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las carpetas</SelectItem>
            <SelectItem value="default">Carpeta predeterminada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Segments Table */}
      <Card className="border-[#E5E7EB]">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#E5E7EB] hover:bg-transparent">
                <TableHead className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  Segmento
                </TableHead>
                <TableHead className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider w-[100px]">
                  ID
                </TableHead>
                <TableHead className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider w-[150px]">
                  Carpeta
                </TableHead>
                <TableHead className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider w-[120px]">
                  Contactos
                </TableHead>
                <TableHead className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider w-[150px]">
                  <div className="flex items-center gap-1">
                    Última modificación
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider w-[80px]">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {segments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-[400px]">
                    <div className="flex flex-col items-center justify-center">
                      {/* Illustration */}
                      <div className="relative mb-6">
                        <svg
                          width="200"
                          height="150"
                          viewBox="0 0 200 150"
                          fill="none"
                          className="mx-auto"
                        >
                          {/* Background shapes */}
                          <ellipse
                            cx="100"
                            cy="120"
                            rx="80"
                            ry="20"
                            fill="#E6F9F0"
                          />
                          
                          {/* Person sitting */}
                          <path
                            d="M60 80 Q70 70 80 80 L85 110 L55 110 Z"
                            fill="#00D26A"
                            opacity="0.8"
                          />
                          <circle cx="75" cy="65" r="12" fill="#00D26A" />
                          
                          {/* Arm */}
                          <path
                            d="M80 85 Q95 75 100 90"
                            stroke="#00D26A"
                            strokeWidth="4"
                            fill="none"
                          />
                          
                          {/* Chart/Pie icon */}
                          <circle
                            cx="130"
                            cy="70"
                            r="20"
                            fill="#00D26A"
                            opacity="0.3"
                          />
                          <path
                            d="M130 70 L130 50 A20 20 0 0 1 150 70 Z"
                            fill="#00D26A"
                            opacity="0.6"
                          />
                          <path
                            d="M130 70 L110 70 A20 20 0 0 1 130 50 Z"
                            fill="#00D26A"
                            opacity="0.4"
                          />
                          
                          {/* Filter funnel */}
                          <path
                            d="M45 45 L65 45 L60 60 L55 65 L50 60 Z"
                            fill="#00D26A"
                            opacity="0.5"
                          />
                          
                          {/* Decorative elements */}
                          <circle cx="40" cy="50" r="3" fill="#00D26A" opacity="0.5" />
                          <circle cx="160" cy="40" r="4" fill="#00D26A" opacity="0.3" />
                          <path
                            d="M45 100 L50 95 L55 100"
                            stroke="#00D26A"
                            strokeWidth="2"
                            fill="none"
                            opacity="0.5"
                          />
                        </svg>
                      </div>

                      <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
                        Aún no tienes segmentos en esta carpeta
                      </h3>
                      <p className="text-sm text-[#6B7280] text-center max-w-md">
                        Añade nuevos segmentos y continúa enriqueciendo tu base de datos de contactos.
                      </p>
                      <Button className="mt-6 gap-2 bg-[#00D26A] hover:bg-[#00B85C]">
                        <Plus className="h-4 w-4" />
                        Crear segmento
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                segments.map((segment) => (
                  <TableRow
                    key={segment.id}
                    className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB]"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-[#E6F9F0] flex items-center justify-center">
                          <PieChart className="h-4 w-4 text-[#00D26A]" />
                        </div>
                        <span className="font-medium text-[#1A1A1A]">
                          {segment.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-[#6B7280]">{segment.id}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FolderOpen className="h-4 w-4 text-[#9CA3AF]" />
                        <span className="text-sm text-[#6B7280]">
                          {segment.folder || "Carpeta predeterminada"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-[#1A1A1A] font-medium">
                        {segment.contactCount || 0}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-[#6B7280]">
                        {segment.updatedAt || "-"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4 text-[#6B7280]" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2">
                            <ExternalLink className="h-4 w-4" />
                            Ver contactos
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Pencil className="h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-[#EF4444] gap-2">
                            <Trash2 className="h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
