"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Users, Filter, Search, CheckSquare, Square, GraduationCap, Building, UserCircle, X } from "lucide-react";

// Tipos de contacto expandidos
export interface Contact {
  id: number;
  name: string;
  email: string;
  company?: string;
  type: "estudiante" | "docente" | "administrativo" | "externo" | "general";
  group: string;
  enrollmentStatus?: "matriculado" | "no_matriculado" | "egresado" | "pendiente";
  promotion?: string;
  career?: string;
  semester?: number;
  added: string;
}

interface AudienceSelectorProps {
  contacts: Contact[];
  selectedContacts: number[];
  onSelectionChange: (selectedIds: number[]) => void;
}

// Filtros disponibles
const contactTypes = [
  { value: "all", label: "Todos los tipos" },
  { value: "estudiante", label: "Estudiantes" },
  { value: "docente", label: "Docentes" },
  { value: "administrativo", label: "Administrativo" },
  { value: "externo", label: "Externos" },
  { value: "general", label: "Público General" },
];

const enrollmentStatuses = [
  { value: "all", label: "Todos los estados" },
  { value: "matriculado", label: "Matriculados" },
  { value: "no_matriculado", label: "No Matriculados" },
  { value: "egresado", label: "Egresados" },
  { value: "pendiente", label: "Matrícula Pendiente" },
];

const promotions = [
  { value: "all", label: "Todas las promociones" },
  { value: "2026-I", label: "2026-I" },
  { value: "2025-II", label: "2025-II" },
  { value: "2025-I", label: "2025-I" },
  { value: "2024-II", label: "2024-II" },
  { value: "2024-I", label: "2024-I" },
  { value: "2023-II", label: "2023-II" },
  { value: "2023-I", label: "2023-I" },
];

const careers = [
  { value: "all", label: "Todas las carreras" },
  { value: "ingenieria_sistemas", label: "Ingeniería de Sistemas" },
  { value: "ingenieria_civil", label: "Ingeniería Civil" },
  { value: "medicina", label: "Medicina" },
  { value: "derecho", label: "Derecho" },
  { value: "administracion", label: "Administración" },
  { value: "contabilidad", label: "Contabilidad" },
  { value: "psicologia", label: "Psicología" },
];

export function AudienceSelector({
  contacts,
  selectedContacts,
  onSelectionChange,
}: AudienceSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    type: "all",
    enrollmentStatus: "all",
    promotion: "all",
    career: "all",
  });

  // Filtrar contactos
  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const matchesSearch =
        searchTerm === "" ||
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        filters.type === "all" || contact.type === filters.type;

      const matchesEnrollment =
        filters.enrollmentStatus === "all" ||
        contact.enrollmentStatus === filters.enrollmentStatus;

      const matchesPromotion =
        filters.promotion === "all" || contact.promotion === filters.promotion;

      const matchesCareer =
        filters.career === "all" || contact.career === filters.career;

      return (
        matchesSearch &&
        matchesType &&
        matchesEnrollment &&
        matchesPromotion &&
        matchesCareer
      );
    });
  }, [contacts, searchTerm, filters]);

  // Estadísticas de selección
  const selectionStats = useMemo(() => {
    const selected = contacts.filter((c) => selectedContacts.includes(c.id));
    return {
      total: selected.length,
      byType: selected.reduce((acc, contact) => {
        acc[contact.type] = (acc[contact.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }, [contacts, selectedContacts]);

  const toggleContact = (contactId: number) => {
    if (selectedContacts.includes(contactId)) {
      onSelectionChange(selectedContacts.filter((id) => id !== contactId));
    } else {
      onSelectionChange([...selectedContacts, contactId]);
    }
  };

  const selectAll = () => {
    const allIds = filteredContacts.map((c) => c.id);
    const newSelection = [...new Set([...selectedContacts, ...allIds])];
    onSelectionChange(newSelection);
  };

  const deselectAll = () => {
    const filteredIds = filteredContacts.map((c) => c.id);
    const newSelection = selectedContacts.filter(
      (id) => !filteredIds.includes(id)
    );
    onSelectionChange(newSelection);
  };

  const clearFilters = () => {
    setFilters({
      type: "all",
      enrollmentStatus: "all",
      promotion: "all",
      career: "all",
    });
    setSearchTerm("");
  };

  const getContactTypeIcon = (type: string) => {
    switch (type) {
      case "estudiante":
        return <GraduationCap className="h-4 w-4" />;
      case "docente":
        return <UserCircle className="h-4 w-4" />;
      case "administrativo":
        return <Building className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getContactTypeLabel = (type: string) => {
    const found = contactTypes.find((t) => t.value === type);
    return found?.label || type;
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Panel de Filtros */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
          <CardDescription>
            Filtra tu audiencia objetivo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Búsqueda</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Tipo de Contacto</Label>
            <Select
              value={filters.type}
              onValueChange={(value) =>
                setFilters((f) => ({ ...f, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {contactTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="advanced">
              <AccordionTrigger>Filtros Avanzados</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Estado de Matrícula</Label>
                  <Select
                    value={filters.enrollmentStatus}
                    onValueChange={(value) =>
                      setFilters((f) => ({ ...f, enrollmentStatus: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {enrollmentStatuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Promoción</Label>
                  <Select
                    value={filters.promotion}
                    onValueChange={(value) =>
                      setFilters((f) => ({ ...f, promotion: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {promotions.map((promo) => (
                        <SelectItem key={promo.value} value={promo.value}>
                          {promo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Carrera</Label>
                  <Select
                    value={filters.career}
                    onValueChange={(value) =>
                      setFilters((f) => ({ ...f, career: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {careers.map((career) => (
                        <SelectItem key={career.value} value={career.value}>
                          {career.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="w-full"
          >
            <X className="mr-2 h-4 w-4" />
            Limpiar Filtros
          </Button>
        </CardContent>
      </Card>

      {/* Lista de Contactos */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Seleccionar Destinatarios</CardTitle>
              <CardDescription>
                {filteredContacts.length} contactos encontrados
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={selectAll}>
                <CheckSquare className="mr-2 h-4 w-4" />
                Seleccionar todos
              </Button>
              <Button variant="outline" size="sm" onClick={deselectAll}>
                <Square className="mr-2 h-4 w-4" />
                Deseleccionar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-2">
              {filteredContacts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No se encontraron contactos con los filtros seleccionados
                </div>
              ) : (
                filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => toggleContact(contact.id)}
                  >
                    <Checkbox
                      checked={selectedContacts.includes(contact.id)}
                      onCheckedChange={() => toggleContact(contact.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">
                          {contact.name}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {getContactTypeIcon(contact.type)}
                          <span className="ml-1">
                            {getContactTypeLabel(contact.type)}
                          </span>
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {contact.email}
                      </div>
                      <div className="flex gap-2 mt-1">
                        {contact.enrollmentStatus && (
                          <Badge variant="outline" className="text-xs">
                            {contact.enrollmentStatus === "matriculado"
                              ? "Matriculado"
                              : contact.enrollmentStatus === "no_matriculado"
                              ? "No Matriculado"
                              : contact.enrollmentStatus === "egresado"
                              ? "Egresado"
                              : "Pendiente"}
                          </Badge>
                        )}
                        {contact.promotion && (
                          <Badge variant="outline" className="text-xs">
                            Promo: {contact.promotion}
                          </Badge>
                        )}
                        {contact.career && (
                          <Badge variant="outline" className="text-xs">
                            {contact.career
                              .replace("_", " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Resumen de Selección */}
      {selectedContacts.length > 0 && (
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Resumen de Selección
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="text-lg px-3 py-1">
                  {selectionStats.total}
                </Badge>
                <span className="text-muted-foreground">
                  contactos seleccionados
                </span>
              </div>
              {Object.entries(selectionStats.byType).map(([type, count]) => (
                <div key={type} className="flex items-center gap-2">
                  <Badge variant="outline" className="text-sm">
                    {getContactTypeIcon(type)}
                    <span className="ml-1">
                      {getContactTypeLabel(type)}: {count}
                    </span>
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
