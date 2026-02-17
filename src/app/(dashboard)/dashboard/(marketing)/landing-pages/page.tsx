"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Plus, ExternalLink } from "lucide-react";

export default function LandingPagesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-[#1A1A1A]">Landing pages</h1>
          <Crown className="h-6 w-6 text-[#FBBF24]" />
        </div>
        <Button className="gap-2 bg-[#1A1A1A] hover:bg-[#374151]">
          <Plus className="h-4 w-4" />
          Crear landing page
        </Button>
      </div>

      {/* Premium Feature Notice */}
      <Card className="border-[#E5E7EB]">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 rounded-full bg-[#FEF3C7] flex items-center justify-center mb-4">
              <Crown className="h-8 w-8 text-[#F59E0B]" />
            </div>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2">
              Funcionalidad Premium
            </h2>
            <p className="text-sm text-[#6B7280] max-w-md mb-4">
              Las landing pages están disponibles en los planes superiores. 
              Crea páginas de destino profesionales sin necesidad de código.
            </p>
            <Button className="gap-2 bg-[#00D26A] hover:bg-[#00B85C]">
              <ExternalLink className="h-4 w-4" />
              Ver planes disponibles
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
