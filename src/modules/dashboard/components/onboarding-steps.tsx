import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function OnboardingSteps() {
  return (
    <Card className="lg:col-span-2 border-[#E5E7EB]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-[#1A1A1A]">
            Primeros pasos con EmailSent
          </CardTitle>
          <Button className="bg-[#1A1A1A] hover:bg-[#374151]">
            Crear campaña
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="h-16 w-16 rounded-lg bg-[#E6F9F0] flex items-center justify-center">
                <span className="text-3xl font-bold text-[#00D26A]">1</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[#1A1A1A] mb-2">
                Añade tus primeros contactos
              </h3>
              <p className="text-sm text-[#6B7280] mb-4">
                Necesitas contactos para crear una campaña. Crea tu base de datos de contactos o añade el destinatario de tu primera campaña.
              </p>
              <Button variant="link" className="p-0 h-auto text-[#6366F1] font-medium">
                Importa tus contactos
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="h-16 w-16 rounded-lg bg-[#E6F9F0] flex items-center justify-center">
                <span className="text-3xl font-bold text-[#00D26A]">2</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[#1A1A1A] mb-2">
                Crea tu primera campaña
              </h3>
              <p className="text-sm text-[#6B7280] mb-4">
                Es hora de ser creativos y elaborar una campaña. ¿Necesitas inspiración? Elige una plantilla de email y utiliza nuestro asistente de redacción de IA.
              </p>
              <Button variant="link" className="p-0 h-auto text-[#6366F1] font-medium">
                Crear tu primera campaña
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
