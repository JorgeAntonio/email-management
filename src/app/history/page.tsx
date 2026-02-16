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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, RotateCcw, Download, CheckCircle2, XCircle, Clock } from "lucide-react";

const historyItems = [
  { id: 1, recipient: "juan@empresa.com", subject: "Bienvenida a nuestro servicio", date: "2026-02-16 10:30", type: "Individual", status: "Entregado", opened: true },
  { id: 2, recipient: "maria@correo.com", subject: "Promoción especial de febrero", date: "2026-02-16 09:15", type: "Campaña", status: "Entregado", opened: true },
  { id: 3, recipient: "carlos@empresa.com", subject: "Actualización importante", date: "2026-02-16 08:45", type: "Individual", status: "Entregado", opened: false },
  { id: 4, recipient: "ana@correo.com", subject: "Recordatorio de pago", date: "2026-02-15 16:20", type: "Individual", status: "Fallido", opened: false },
  { id: 5, recipient: "pedro@empresa.com", subject: "Newsletter mensual", date: "2026-02-15 14:00", type: "Campaña", status: "Entregado", opened: true },
  { id: 6, recipient: "laura@correo.com", subject: "Confirmación de pedido", date: "2026-02-15 11:30", type: "Individual", status: "Pendiente", opened: false },
];

const statusIcons = {
  Entregado: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  Fallido: <XCircle className="h-4 w-4 text-red-500" />,
  Pendiente: <Clock className="h-4 w-4 text-yellow-500" />,
};

export default function HistoryPage() {
  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Historial</h1>
          <p className="text-muted-foreground">
            Registro de todos los correos enviados
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar Historial
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar en historial..." className="pl-8" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="delivered">Entregado</SelectItem>
            <SelectItem value="failed">Fallido</SelectItem>
            <SelectItem value="pending">Pendiente</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            <SelectItem value="individual">Individual</SelectItem>
            <SelectItem value="campaign">Campaña</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Enviados (Hoy)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Entregados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">238</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Fallidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">3</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Apertura</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68.5%</div>
          </CardContent>
        </Card>
      </div>

      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registro de Envíos</CardTitle>
          <CardDescription>
            Historial completo de correos enviados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Destinatario</TableHead>
                <TableHead>Asunto</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Abierto</TableHead>
                <TableHead className="w-[100px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historyItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.recipient}</TableCell>
                  <TableCell>{item.subject}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {statusIcons[item.status as keyof typeof statusIcons]}
                      <span>{item.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.opened ? (
                      <Badge variant="secondary">Sí</Badge>
                    ) : (
                      <Badge variant="outline">No</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {item.status === "Fallido" && (
                        <Button variant="ghost" size="sm">
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
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
