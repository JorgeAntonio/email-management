import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Mail, MessageSquare, Sparkles, Settings, Users } from "lucide-react";

export function UsagePlan() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
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

      <Card className="lg:col-span-2 border-[#E5E7EB]">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#1A1A1A]">
            Uso de tu plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
  );
}
