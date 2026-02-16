"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Datos de ejemplo para el gráfico
const dailyData = [
  { date: "01 Feb", sent: 1200, opened: 850, clicked: 180 },
  { date: "02 Feb", sent: 1350, opened: 920, clicked: 210 },
  { date: "03 Feb", sent: 1100, opened: 780, clicked: 165 },
  { date: "04 Feb", sent: 1400, opened: 1050, clicked: 240 },
  { date: "05 Feb", sent: 1250, opened: 890, clicked: 195 },
  { date: "06 Feb", sent: 1500, opened: 1150, clicked: 280 },
  { date: "07 Feb", sent: 1300, opened: 980, clicked: 220 },
  { date: "08 Feb", sent: 1450, opened: 1080, clicked: 255 },
  { date: "09 Feb", sent: 1600, opened: 1200, clicked: 290 },
  { date: "10 Feb", sent: 1380, opened: 1020, clicked: 235 },
  { date: "11 Feb", sent: 1520, opened: 1120, clicked: 268 },
  { date: "12 Feb", sent: 1280, opened: 920, clicked: 198 },
  { date: "13 Feb", sent: 1420, opened: 1050, clicked: 242 },
  { date: "14 Feb", sent: 1650, opened: 1280, clicked: 315 },
  { date: "15 Feb", sent: 1480, opened: 1100, clicked: 258 },
  { date: "16 Feb", sent: 1350, opened: 980, clicked: 225 },
];

const weeklyData = [
  { date: "Semana 1", sent: 8900, opened: 6540, clicked: 1420 },
  { date: "Semana 2", sent: 9800, opened: 7200, clicked: 1650 },
  { date: "Semana 3", sent: 9200, opened: 6850, clicked: 1520 },
  { date: "Semana 4", sent: 6680, opened: 5160, clicked: 1180 },
];

const monthlyData = [
  { date: "Nov 2025", sent: 42000, opened: 31500, clicked: 7200 },
  { date: "Dic 2025", sent: 38500, opened: 28800, clicked: 6500 },
  { date: "Ene 2026", sent: 45800, opened: 34200, clicked: 7800 },
  { date: "Feb 2026", sent: 24580, opened: 18750, clicked: 4230 },
];

interface TimelineChartProps {
  data?: typeof dailyData;
  period?: "daily" | "weekly" | "monthly";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-[#E5E7EB] rounded-lg shadow-lg">
        <p className="font-semibold text-[#1A1A1A] mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-[#6B7280]">{entry.name}:</span>
            <span className="font-medium text-[#1A1A1A]">
              {entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export function TimelineChart({
  period = "daily",
}: TimelineChartProps) {
  const data = period === "daily" ? dailyData : period === "weekly" ? weeklyData : monthlyData;

  return (
    <Card className="border-[#E5E7EB]">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-[#1A1A1A]">
            Rendimiento en el tiempo
          </CardTitle>
          <Tabs defaultValue={period} className="w-auto">
            <TabsList className="bg-[#F3F4F6]">
              <TabsTrigger
                value="daily"
                className="data-[state=active]:bg-white data-[state=active]:text-[#1A1A1A]"
              >
                Diario
              </TabsTrigger>
              <TabsTrigger
                value="weekly"
                className="data-[state=active]:bg-white data-[state=active]:text-[#1A1A1A]"
              >
                Semanal
              </TabsTrigger>
              <TabsTrigger
                value="monthly"
                className="data-[state=active]:bg-white data-[state=active]:text-[#1A1A1A]"
              >
                Mensual
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="date"
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value
                }
              />
              <Tooltip content={(props) => <CustomTooltip {...props} />} />
              <Legend
                wrapperStyle={{
                  paddingTop: "20px",
                }}
              />
              <Line
                type="monotone"
                dataKey="sent"
                name="Enviados"
                stroke="#00D26A"
                strokeWidth={3}
                dot={{ fill: "#00D26A", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="opened"
                name="Abiertos"
                stroke="#6366F1"
                strokeWidth={3}
                dot={{ fill: "#6366F1", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="clicked"
                name="Clics"
                stroke="#F59E0B"
                strokeWidth={3}
                dot={{ fill: "#F59E0B", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
