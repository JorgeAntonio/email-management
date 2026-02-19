"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Upload,
  Search,
  Settings,
  ChevronDown,
  MoreHorizontal,
  Mail,
  MessageSquare,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Mock data para contactos
const contacts = [
  {
    id: 1,
    email: "jorge.antonio.delaguila@gmail.com",
    firstName: "Jorge",
    lastName: "Del Aguila",
    subscribed: true,
    emailChannel: true,
    smsChannel: false,
    blocklisted: false,
    lastActivity: "16/02/2026",
    createdAt: "16/02/2026",
  },
  {
    id: 2,
    email: "maria.garcia@empresa.com",
    firstName: "María",
    lastName: "García",
    subscribed: true,
    emailChannel: true,
    smsChannel: true,
    blocklisted: false,
    lastActivity: "15/02/2026",
    createdAt: "10/02/2026",
  },
  {
    id: 3,
    email: "carlos.rodriguez@universidad.edu",
    firstName: "Carlos",
    lastName: "Rodríguez",
    subscribed: true,
    emailChannel: true,
    smsChannel: false,
    blocklisted: false,
    lastActivity: "14/02/2026",
    createdAt: "08/02/2026",
  },
  {
    id: 4,
    email: "ana.martinez@gmail.com",
    firstName: "Ana",
    lastName: "Martínez",
    subscribed: false,
    emailChannel: false,
    smsChannel: false,
    blocklisted: true,
    lastActivity: "10/02/2026",
    createdAt: "05/02/2026",
  },
  {
    id: 5,
    email: "pedro.sanchez@empresa.com",
    firstName: "Pedro",
    lastName: "Sánchez",
    subscribed: true,
    emailChannel: true,
    smsChannel: true,
    blocklisted: false,
    lastActivity: "12/02/2026",
    createdAt: "01/02/2026",
  },
];

const columns = [
  { id: "contact", label: "CONTACTO", width: "w-[25%]" },
  { id: "subscribed", label: "SUSCRITO", width: "w-[15%]" },
  { id: "blocklisted", label: "EN LA LISTA BLOQUEADA", width: "w-[20%]" },
  { id: "email", label: "EMAIL", width: "w-[20%]" },
  { id: "lastActivity", label: "ÚLTIMA ACTIVIDAD", width: "w-[15%]" },
  { id: "createdAt", label: "FECHA DE CREACIÓN", width: "w-[15%]" },
];

export default function ContactsPage() {
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const toggleContact = (id: number) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map((c) => c.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#1A1A1A]">Contactos</h1>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="gap-2 border-[#E5E7EB] text-[#1A1A1A] hover:bg-[#F3F4F6]"
          >
            <Plus className="h-4 w-4" />
            Añadir contacto
          </Button>
          <Button className="gap-2 bg-[#1A1A1A] hover:bg-[#374151]">
            <Upload className="h-4 w-4" />
            Importar contactos
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="border-b border-[#E5E7EB] w-full justify-start rounded-none bg-transparent h-auto p-0">
          <TabsTrigger
            value="all"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#00D26A] data-[state=active]:text-[#00D26A] data-[state=active]:bg-transparent px-4 py-3 text-[#6B7280]"
          >
            Todos los contactos
          </TabsTrigger>
          <TabsTrigger
            value="lists"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#00D26A] data-[state=active]:text-[#00D26A] data-[state=active]:bg-transparent px-4 py-3 text-[#6B7280]"
          >
            Listas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {/* Filters Bar */}
          <Card className="border-[#E5E7EB] mb-4">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Select>
                  <SelectTrigger className="w-[250px] border-[#E5E7EB]">
                    <SelectValue placeholder="Cargar una lista o un segmento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los contactos</SelectItem>
                    <SelectItem value="subscribers">Suscritos</SelectItem>
                    <SelectItem value="unsubscribed">No suscritos</SelectItem>
                    <SelectItem value="blocklisted">Bloqueados</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  className="gap-2 border-[#E5E7EB] text-[#6B7280]"
                >
                  <Filter className="h-4 w-4" />
                  Añadir filtro
                  <ChevronDown className="h-4 w-4" />
                </Button>

                <div className="ml-auto flex items-center gap-4">
                  <Button
                    variant="ghost"
                    className="gap-2 text-[#6366F1] hover:text-[#4F46E5]"
                  >
                    <Settings className="h-4 w-4" />
                    Personalizar columnas
                  </Button>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                    <Input
                      placeholder="Buscar"
                      className="pl-10 w-[300px] border-[#E5E7EB]"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results count */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-[#1A1A1A] font-medium">
              {contacts.length} contacto
            </span>
            <span className="text-[#9CA3AF]">ⓘ</span>
          </div>

          {/* Contacts Table */}
          <Card className="border-[#E5E7EB]">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-[#E5E7EB] hover:bg-transparent">
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={selectedContacts.length === contacts.length}
                        onCheckedChange={selectAll}
                      />
                    </TableHead>
                    {columns.map((column) => (
                      <TableHead
                        key={column.id}
                        className={`text-xs font-semibold text-[#6B7280] uppercase tracking-wider ${column.width}`}
                      >
                        {column.label}
                      </TableHead>
                    ))}
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow
                      key={contact.id}
                      className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB]"
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedContacts.includes(contact.id)}
                          onCheckedChange={() => toggleContact(contact.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-[#6366F1] font-medium truncate max-w-[200px]">
                            {contact.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {contact.emailChannel && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-[#E6F9F0] text-[#00D26A]">
                              <Mail className="h-3 w-3" />
                              Email
                            </span>
                          )}
                          {contact.smsChannel && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-[#E6F9F0] text-[#00D26A]">
                              <MessageSquare className="h-3 w-3" />
                              SMS
                            </span>
                          )}
                          {!contact.emailChannel && !contact.smsChannel && (
                            <span className="text-[#9CA3AF] text-sm">-</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {contact.blocklisted ? (
                          <span className="text-[#EF4444] text-sm">Sí</span>
                        ) : (
                          <span className="text-[#9CA3AF] text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-[#6366F1] font-medium truncate max-w-[180px] block">
                          {contact.email}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-[#6B7280]">
                          {contact.lastActivity}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-[#6B7280]">
                          {contact.createdAt}
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
                            <DropdownMenuItem>Ver detalle</DropdownMenuItem>
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem className="text-[#EF4444]">
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-4 border-t border-[#E5E7EB]">
                <div className="flex items-center gap-4">
                  <Select
                    value={rowsPerPage.toString()}
                    onValueChange={(value) => setRowsPerPage(Number(value))}
                  >
                    <SelectTrigger className="w-[80px] border-[#E5E7EB]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-[#6B7280]">Filas por página</span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm text-[#6B7280]">
                    1-{contacts.length} of {contacts.length}
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
                      1
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-[#E5E7EB]"
                      disabled
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <span className="text-sm text-[#6B7280]">of 1 pages</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lists" className="mt-6">
          {/* Empty state for lists */}
          <Card className="border-[#E5E7EB]">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="h-32 w-32 mb-6">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="45" fill="#E6F9F0" />
                  <path
                    d="M30 40 L50 25 L70 40 L70 70 L30 70 Z"
                    fill="#00D26A"
                    opacity="0.3"
                  />
                  <path
                    d="M35 45 L50 35 L65 45 L65 65 L35 65 Z"
                    fill="#00D26A"
                    opacity="0.5"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                Aún no tienes listas
              </h3>
              <p className="text-sm text-[#6B7280] text-center max-w-md">
                Las listas te permiten organizar tus contactos en grupos. Crea tu primera lista para comenzar.
              </p>
              <Button className="mt-6 gap-2 bg-[#00D26A] hover:bg-[#00B85C]">
                <Plus className="h-4 w-4" />
                Crear lista
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
