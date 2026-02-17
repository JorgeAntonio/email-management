"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FormInput } from "lucide-react";

export default function FormsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#1A1A1A]">Formularios</h1>
        <Button className="gap-2 bg-[#1A1A1A] hover:bg-[#374151]">
          <Plus className="h-4 w-4" />
          Crear formulario
        </Button>
      </div>

      {/* Empty State */}
      <Card className="border-[#E5E7EB]">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 rounded-full bg-[#E6F9F0] flex items-center justify-center mb-4">
              <FormInput className="h-8 w-8 text-[#00D26A]" />
            </div>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2">
              Crea tu primer formulario
            </h2>
            <p className="text-sm text-[#6B7280] max-w-md mb-4">
              Los formularios te permiten capturar leads y suscribir contactos 
              directamente desde tu sitio web.
            </p>
            <Button className="gap-2 bg-[#00D26A] hover:bg-[#00B85C]">
              <Plus className="h-4 w-4" />
              Crear formulario
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
