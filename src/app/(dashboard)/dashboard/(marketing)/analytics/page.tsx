"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MetricsCards } from "@/modules/analytics/metrics-cards";
import { TimelineChart } from "@/modules/analytics/timeline-chart";
import { CampaignPerformanceTable } from "@/modules/analytics/campaign-performance-table";
import { Download, Calendar, TrendingUp, Users, Mail } from "lucide-react";

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("30d");

  const getChartPeriod = (range: string): "daily" | "weekly" | "monthly" => {
    if (range === "7d") return "daily";
    if (range === "30d" || range === "90d") return "weekly";
    return "monthly";
  };

  // Métricas de ejemplo
  const metrics = {
    sent: 24580,
    opened: 18750,
    clicked: 4230,
    bounced: 180,
    previousPeriod: {
      sent: 22300,
      opened: 16500,
      clicked: 3800,
      bounced: 210,
    },
  };

  const dateRangeLabels: Record<string, string> = {
    "7d": "últimos 7 días",
    "30d": "últimos 30 días",
    "90d": "últimos 90 días",
    "1y": "este año",
  };

  const handleExport = () => {
    // Simular exportación
    alert("Exportando datos de analytics...");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A1A]">Estadísticas</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Analiza el rendimiento de tus campañas y contactos
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="gap-2 border-[#E5E7EB]"
            onClick={handleExport}
          >
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Date Range Selector */}
      <Card className="border-[#E5E7EB]">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#6B7280]" />
              <span className="text-sm text-[#6B7280]">Período:</span>
            </div>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[200px] border-[#E5E7EB]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Últimos 7 días</SelectItem>
                <SelectItem value="30d">Últimos 30 días</SelectItem>
                <SelectItem value="90d">Últimos 90 días</SelectItem>
                <SelectItem value="1y">Este año</SelectItem>
              </SelectContent>
            </Select>
            <div className="ml-auto flex items-center gap-2 text-sm text-[#6B7280]">
              <span>Comparando con:</span>
              <span className="font-medium text-[#1A1A1A]">
                {dateRangeLabels[dateRange]} anterior
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-[#E5E7EB]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-[#E6F9F0] flex items-center justify-center">
                <Mail className="h-6 w-6 text-[#00D26A]" />
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Total de campañas</p>
                <p className="text-2xl font-bold text-[#1A1A1A]">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E5E7EB]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-[#EEF2FF] flex items-center justify-center">
                <Users className="h-6 w-6 text-[#6366F1]" />
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Alcance total</p>
                <p className="text-2xl font-bold text-[#1A1A1A]">24,580</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E5E7EB]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-[#FEF3C7] flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-[#F59E0B]" />
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Crecimiento</p>
                <p className="text-2xl font-bold text-[#00D26A]">+18.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metrics Cards */}
      <section>
        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">
          Métricas principales
        </h2>
        <MetricsCards
          metrics={metrics}
          dateRange={dateRangeLabels[dateRange]}
        />
      </section>

      {/* Timeline Chart */}
      <section>
        <TimelineChart period={getChartPeriod(dateRange)} />
      </section>

      {/* Campaign Performance Table */}
      <section>
        <CampaignPerformanceTable />
      </section>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-[#E5E7EB]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#1A1A1A]">
              Mejores horarios de envío
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">Martes 10:00 AM</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                    <div className="w-[85%] h-full bg-[#00D26A] rounded-full" />
                  </div>
                  <span className="text-sm font-medium text-[#1A1A1A]">85%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">Jueves 2:00 PM</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                    <div className="w-[78%] h-full bg-[#00D26A] rounded-full" />
                  </div>
                  <span className="text-sm font-medium text-[#1A1A1A]">78%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">Miércoles 9:00 AM</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                    <div className="w-[72%] h-full bg-[#00D26A] rounded-full" />
                  </div>
                  <span className="text-sm font-medium text-[#1A1A1A]">72%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E5E7EB]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#1A1A1A]">
              Dispositivos más usados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-[#E6F9F0] flex items-center justify-center">
                    <svg className="h-4 w-4 text-[#00D26A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-sm text-[#1A1A1A]">Móvil</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                    <div className="w-[65%] h-full bg-[#6366F1] rounded-full" />
                  </div>
                  <span className="text-sm font-medium text-[#1A1A1A]">65%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-[#EEF2FF] flex items-center justify-center">
                    <svg className="h-4 w-4 text-[#6366F1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-sm text-[#1A1A1A]">Escritorio</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                    <div className="w-[30%] h-full bg-[#6366F1] rounded-full" />
                  </div>
                  <span className="text-sm font-medium text-[#1A1A1A]">30%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-[#FEF3C7] flex items-center justify-center">
                    <svg className="h-4 w-4 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-sm text-[#1A1A1A]">Tablet</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                    <div className="w-[5%] h-full bg-[#6366F1] rounded-full" />
                  </div>
                  <span className="text-sm font-medium text-[#1A1A1A]">5%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
