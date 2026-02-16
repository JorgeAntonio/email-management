"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Target,
  Filter,
  Save,
  Mail,
  GraduationCap,
  UserCircle,
  Building,
  ExternalLink,
  BarChart3,
  PieChart,
} from "lucide-react";
import { Contact } from "@/modules/audience/audience-selector";

// Mock data extendido
const mockContacts: Contact[] = [
  {
    id: 1,
    name: "Juan Carlos Pérez",
    email: "juan.perez@universidad.edu",
    type: "estudiante",
    group: "Estudiantes",
    enrollmentStatus: "matriculado",
    promotion: "2026-I",
    career: "ingenieria_sistemas",
    semester: 8,
    added: "2026-02-10",
  },
  {
    id: 2,
    name: "María García López",
    email: "maria.garcia@universidad.edu",
    type: "estudiante",
    group: "Estudiantes",
    enrollmentStatus: "matriculado",
    promotion: "2025-II",
    career: "medicina",
    semester: 6,
    added: "2026-02-09",
  },
  {
    id: 3,
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@universidad.edu",
    type: "estudiante",
    group: "Estudiantes",
    enrollmentStatus: "no_matriculado",
    promotion: "2024-I",
    career: "derecho",
    semester: 10,
    added: "2026-02-08",
  },
  {
    id: 4,
    name: "Ana Martínez Silva",
    email: "ana.martinez@universidad.edu",
    type: "estudiante",
    group: "Estudiantes",
    enrollmentStatus: "egresado",
    promotion: "2023-II",
    career: "administracion",
    semester: 10,
    added: "2026-02-07",
  },
  {
    id: 5,
    name: "Dr. Pedro Sánchez",
    email: "pedro.sanchez@universidad.edu",
    type: "docente",
    group: "Docentes",
    career: "ingenieria_sistemas",
    added: "2026-02-06",
  },
  {
    id: 6,
    name: "Dra. Laura González",
    email: "laura.gonzalez@universidad.edu",
    type: "docente",
    group: "Docentes",
    career: "medicina",
    added: "2026-02-05",
  },
  {
    id: 7,
    name: "Roberto Díaz",
    email: "roberto.diaz@empresa.com",
    type: "externo",
    group: "Externos",
    company: "Tech Corp",
    added: "2026-02-04",
  },
  {
    id: 8,
    name: "Carmen Vargas",
    email: "carmen.vargas@universidad.edu",
    type: "administrativo",
    group: "Administrativo",
    added: "2026-02-03",
  },
  {
    id: 9,
    name: "Luis Torres",
    email: "luis.torres@universidad.edu",
    type: "estudiante",
    group: "Estudiantes",
    enrollmentStatus: "pendiente",
    promotion: "2026-I",
    career: "contabilidad",
    semester: 2,
    added: "2026-02-02",
  },
  {
    id: 10,
    name: "Diana Flores",
    email: "diana.flores@universidad.edu",
    type: "estudiante",
    group: "Estudiantes",
    enrollmentStatus: "matriculado",
    promotion: "2025-I",
    career: "psicologia",
    semester: 7,
    added: "2026-02-01",
  },
];

// Segmentos predefinidos
const predefinedSegments = [
  {
    id: 1,
    name: "Todos los Estudiantes Matriculados",
    description: "Estudiantes con matrícula activa",
    filters: { type: "estudiante", enrollmentStatus: "matriculado" },
    icon: GraduationCap,
    color: "bg-green-500",
  },
  {
    id: 2,
    name: "Promoción 2026-I",
    description: "Estudiantes de la promoción 2026-I",
    filters: { type: "estudiante", promotion: "2026-I" },
    icon: Target,
    color: "bg-blue-500",
  },
  {
    id: 3,
    name: "Todos los Docentes",
    description: "Personal docente activo",
    filters: { type: "docente" },
    icon: UserCircle,
    color: "bg-purple-500",
  },
  {
    id: 4,
    name: "Personal Administrativo",
    description: "Staff administrativo",
    filters: { type: "administrativo" },
    icon: Building,
    color: "bg-orange-500",
  },
  {
    id: 5,
    name: "Egresados",
    description: "Estudiantes egresados",
    filters: { type: "estudiante", enrollmentStatus: "egresado" },
    icon: ExternalLink,
    color: "bg-teal-500",
  },
  {
    id: 6,
    name: "Matrícula Pendiente",
    description: "Estudiantes con matrícula pendiente",
    filters: { type: "estudiante", enrollmentStatus: "pendiente" },
    icon: Filter,
    color: "bg-yellow-500",
  },
];

interface FilterState {
  type: string;
  enrollmentStatus: string;
  promotion: string;
  career: string;
}

export default function AudiencePage() {
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    type: "all",
    enrollmentStatus: "all",
    promotion: "all",
    career: "all",
  });
  const [selectedSegment, setSelectedSegment] = useState<number | null>(null);

  // Filtrar contactos
  const filteredContacts = useMemo(() => {
    return mockContacts.filter((contact) => {
      const matchesType =
        activeFilters.type === "all" || contact.type === activeFilters.type;
      const matchesEnrollment =
        activeFilters.enrollmentStatus === "all" ||
        contact.enrollmentStatus === activeFilters.enrollmentStatus;
      const matchesPromotion =
        activeFilters.promotion === "all" ||
        contact.promotion === activeFilters.promotion;
      const matchesCareer =
        activeFilters.career === "all" || contact.career === activeFilters.career;

      return (
        matchesType && matchesEnrollment && matchesPromotion && matchesCareer
      );
    });
  }, [activeFilters]);

  // Estadísticas
  const stats = useMemo(() => {
    const total = filteredContacts.length;
    const byType = filteredContacts.reduce((acc, contact) => {
      acc[contact.type] = (acc[contact.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byEnrollment = filteredContacts.reduce((acc, contact) => {
      if (contact.enrollmentStatus) {
        acc[contact.enrollmentStatus] = (acc[contact.enrollmentStatus] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return { total, byType, byEnrollment };
  }, [filteredContacts]);

  // Aplicar segmento predefinido
  const applySegment = (segmentId: number) => {
    const segment = predefinedSegments.find((s) => s.id === segmentId);
    if (segment) {
      setActiveFilters({
        type: (segment.filters.type as string) || "all",
        enrollmentStatus:
          (segment.filters.enrollmentStatus as string) || "all",
        promotion: (segment.filters.promotion as string) || "all",
        career: "all",
      });
      setSelectedSegment(segmentId);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      estudiante: "Estudiantes",
      docente: "Docentes",
      administrativo: "Administrativo",
      externo: "Externos",
      general: "General",
    };
    return labels[type] || type;
  };

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Audiencias</h1>
          <p className="text-muted-foreground">
            Selecciona y gestiona tus públicos objetivo
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Save className="mr-2 h-4 w-4" />
            Guardar Segmento
          </Button>
          <Button>
            <Mail className="mr-2 h-4 w-4" />
            Enviar Correo
          </Button>
        </div>
      </div>

      <Tabs defaultValue="segments" className="space-y-6">
        <TabsList>
          <TabsTrigger value="segments">
            <Target className="mr-2 h-4 w-4" />
            Segmentos Predefinidos
          </TabsTrigger>
          <TabsTrigger value="custom">
            <Filter className="mr-2 h-4 w-4" />
            Filtros Personalizados
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="mr-2 h-4 w-4" />
            Análisis
          </TabsTrigger>
        </TabsList>

        {/* Segmentos Predefinidos */}
        <TabsContent value="segments" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {predefinedSegments.map((segment) => {
              const Icon = segment.icon;
              const isSelected = selectedSegment === segment.id;

              // Calcular cuántos contactos coinciden con este segmento
              const matchingContacts = mockContacts.filter((contact) => {
                const matchesType =
                  !segment.filters.type || contact.type === segment.filters.type;
                const matchesEnrollment =
                  !segment.filters.enrollmentStatus ||
                  contact.enrollmentStatus === segment.filters.enrollmentStatus;
                const matchesPromotion =
                  !segment.filters.promotion ||
                  contact.promotion === segment.filters.promotion;
                return matchesType && matchesEnrollment && matchesPromotion;
              }).length;

              return (
                <Card
                  key={segment.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => applySegment(segment.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className={`p-2 rounded-lg ${segment.color} text-white`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <Badge variant={isSelected ? "default" : "outline"}>
                        {matchingContacts} contactos
                      </Badge>
                    </div>
                    <CardTitle className="text-base mt-2">{segment.name}</CardTitle>
                    <CardDescription>{segment.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          {/* Resultados del segmento seleccionado */}
          {selectedSegment && (
            <Card>
              <CardHeader>
                <CardTitle>Vista previa del segmento</CardTitle>
                <CardDescription>
                  {stats.total} contactos seleccionados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  {Object.entries(stats.byType).map(([type, count]) => (
                    <div key={type} className="flex items-center gap-2">
                      <Badge variant="secondary">{count}</Badge>
                      <span>{getTypeLabel(type)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Filtros Personalizados */}
        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros Avanzados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>Tipo de Contacto</Label>
                  <Select
                    value={activeFilters.type}
                    onValueChange={(value) =>
                      setActiveFilters((f) => ({ ...f, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="estudiante">Estudiantes</SelectItem>
                      <SelectItem value="docente">Docentes</SelectItem>
                      <SelectItem value="administrativo">Administrativo</SelectItem>
                      <SelectItem value="externo">Externos</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Estado de Matrícula</Label>
                  <Select
                    value={activeFilters.enrollmentStatus}
                    onValueChange={(value) =>
                      setActiveFilters((f) => ({ ...f, enrollmentStatus: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="matriculado">Matriculados</SelectItem>
                      <SelectItem value="no_matriculado">No Matriculados</SelectItem>
                      <SelectItem value="egresado">Egresados</SelectItem>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Promoción</Label>
                  <Select
                    value={activeFilters.promotion}
                    onValueChange={(value) =>
                      setActiveFilters((f) => ({ ...f, promotion: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="2026-I">2026-I</SelectItem>
                      <SelectItem value="2025-II">2025-II</SelectItem>
                      <SelectItem value="2025-I">2025-I</SelectItem>
                      <SelectItem value="2024-II">2024-II</SelectItem>
                      <SelectItem value="2024-I">2024-I</SelectItem>
                      <SelectItem value="2023-II">2023-II</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Carrera</Label>
                  <Select
                    value={activeFilters.career}
                    onValueChange={(value) =>
                      setActiveFilters((f) => ({ ...f, career: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="ingenieria_sistemas">Ing. Sistemas</SelectItem>
                      <SelectItem value="ingenieria_civil">Ing. Civil</SelectItem>
                      <SelectItem value="medicina">Medicina</SelectItem>
                      <SelectItem value="derecho">Derecho</SelectItem>
                      <SelectItem value="administracion">Administración</SelectItem>
                      <SelectItem value="contabilidad">Contabilidad</SelectItem>
                      <SelectItem value="psicologia">Psicología</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resultados */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Resultados del Filtro</CardTitle>
                  <CardDescription>
                    {stats.total} contactos coinciden con tus filtros
                  </CardDescription>
                </div>
                <Badge variant="default" className="text-lg px-4 py-2">
                  {stats.total} seleccionados
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Por tipo */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Por Tipo</h4>
                  <div className="space-y-2">
                    {Object.entries(stats.byType).map(([type, count]) => (
                      <div key={type} className="flex items-center gap-4">
                        <span className="w-32 text-sm">{getTypeLabel(type)}</span>
                        <Progress value={(count / stats.total) * 100} className="flex-1" />
                        <span className="w-12 text-sm text-right">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Por estado de matrícula */}
                {Object.keys(stats.byEnrollment).length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Por Estado de Matrícula</h4>
                    <div className="space-y-2">
                      {Object.entries(stats.byEnrollment).map(([status, count]) => (
                        <div key={status} className="flex items-center gap-4">
                          <span className="w-32 text-sm capitalize">{status}</span>
                          <Progress value={(count / stats.total) * 100} className="flex-1" />
                          <span className="w-12 text-sm text-right">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Análisis */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total Contactos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{mockContacts.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Estudiantes Activos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {mockContacts.filter((c) => c.type === "estudiante" && c.enrollmentStatus === "matriculado").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Promociones Activas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">5</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Distribución por Tipo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-5">
                {["estudiante", "docente", "administrativo", "externo", "general"].map((type) => {
                  const count = mockContacts.filter((c) => c.type === type).length;
                  const percentage = (count / mockContacts.length) * 100;
                  return (
                    <div key={type} className="text-center">
                      <div className="text-2xl font-bold">{count}</div>
                      <div className="text-sm text-muted-foreground">{getTypeLabel(type)}</div>
                      <div className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
