import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Search, Upload, Download, MoreHorizontal, Mail, Building2, User, GraduationCap, Users } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Contact } from "@/components/audience-selector";

// Datos mock expandidos
const contacts: Contact[] = [
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

const getContactTypeIcon = (type: string) => {
  switch (type) {
    case "estudiante":
      return <GraduationCap className="h-4 w-4" />;
    case "docente":
      return <User className="h-4 w-4" />;
    case "administrativo":
      return <Building2 className="h-4 w-4" />;
    default:
      return <Users className="h-4 w-4" />;
  }
};

const getContactTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    estudiante: "Estudiante",
    docente: "Docente",
    administrativo: "Administrativo",
    externo: "Externo",
    general: "General",
  };
  return labels[type] || type;
};

const getEnrollmentStatusLabel = (status?: string) => {
  const labels: Record<string, string> = {
    matriculado: "Matriculado",
    no_matriculado: "No Matriculado",
    egresado: "Egresado",
    pendiente: "Pendiente",
  };
  return status ? labels[status] : "";
};

const getCareerLabel = (career?: string) => {
  if (!career) return "";
  return career
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

export default function ContactsPage() {
  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contactos</h1>
          <p className="text-muted-foreground">
            Gestiona tu base de datos de contactos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Importar CSV
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Contacto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Nuevo Contacto</DialogTitle>
                <DialogDescription>
                  Agrega un nuevo contacto a tu lista
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input id="name" placeholder="Juan Pérez" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input id="email" type="email" placeholder="juan@ejemplo.com" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo de contacto</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="estudiante">Estudiante</SelectItem>
                        <SelectItem value="docente">Docente</SelectItem>
                        <SelectItem value="administrativo">Administrativo</SelectItem>
                        <SelectItem value="externo">Externo</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="group">Grupo</Label>
                    <Input id="group" placeholder="Ej: Estudiantes 2026" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="enrollment">Estado de Matrícula</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="matriculado">Matriculado</SelectItem>
                        <SelectItem value="no_matriculado">No Matriculado</SelectItem>
                        <SelectItem value="egresado">Egresado</SelectItem>
                        <SelectItem value="pendiente">Pendiente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="promotion">Promoción</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar promoción..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2026-I">2026-I</SelectItem>
                        <SelectItem value="2025-II">2025-II</SelectItem>
                        <SelectItem value="2025-I">2025-I</SelectItem>
                        <SelectItem value="2024-II">2024-II</SelectItem>
                        <SelectItem value="2024-I">2024-I</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="career">Carrera</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar carrera..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ingenieria_sistemas">Ingeniería de Sistemas</SelectItem>
                      <SelectItem value="ingenieria_civil">Ingeniería Civil</SelectItem>
                      <SelectItem value="medicina">Medicina</SelectItem>
                      <SelectItem value="derecho">Derecho</SelectItem>
                      <SelectItem value="administracion">Administración</SelectItem>
                      <SelectItem value="contabilidad">Contabilidad</SelectItem>
                      <SelectItem value="psicologia">Psicología</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancelar</Button>
                <Button>Guardar Contacto</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Contactos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,482</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Estudiantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,156</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Docentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Administrativo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Externos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,092</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar contactos..." className="pl-8" />
        </div>
      </div>

      {/* Contacts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Todos los Contactos</CardTitle>
          <CardDescription>
            Lista completa de contactos en tu base de datos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado Matrícula</TableHead>
                <TableHead>Promoción</TableHead>
                <TableHead>Carrera</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      {contact.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {contact.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1">
                      {getContactTypeIcon(contact.type)}
                      <span className="ml-1">{getContactTypeLabel(contact.type)}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {contact.enrollmentStatus ? (
                      <Badge variant={contact.enrollmentStatus === "matriculado" ? "default" : "secondary"}>
                        {getEnrollmentStatusLabel(contact.enrollmentStatus)}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {contact.promotion || <span className="text-muted-foreground">-</span>}
                  </TableCell>
                  <TableCell>
                    {contact.career ? (
                      <Badge variant="outline">{getCareerLabel(contact.career)}</Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem>Enviar correo</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
