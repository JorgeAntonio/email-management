"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    direction: "up" | "down" | "neutral";
    label: string;
  };
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
}

function MetricCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  iconBgColor,
  iconColor,
}: MetricCardProps) {
  const TrendIcon = trend?.direction === "up" 
    ? TrendingUp 
    : trend?.direction === "down" 
    ? TrendingDown 
    : Minus;

  const trendColor = trend?.direction === "up" 
    ? "text-[#00D26A]" 
    : trend?.direction === "down" 
    ? "text-[#EF4444]" 
    : "text-[#6B7280]";

  return (
    <Card className="border-[#E5E7EB] hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-[#6B7280] mb-1">{title}</p>
            <p className="text-3xl font-bold text-[#1A1A1A] mb-2">{value}</p>
            {subtitle && (
              <p className="text-xs text-[#6B7280] mb-2">{subtitle}</p>
            )}
            {trend && (
              <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
                <TrendIcon className="h-4 w-4" />
                <span className="font-medium">
                  {trend.value > 0 ? "+" : ""}{trend.value}%
                </span>
                <span className="text-[#6B7280]">vs {trend.label}</span>
              </div>
            )}
          </div>
          <div
            className={`h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBgColor}`}
          >
            <div className={iconColor}>{icon}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface MetricsCardsProps {
  metrics?: {
    sent: number;
    opened: number;
    clicked: number;
    bounced: number;
    previousPeriod?: {
      sent: number;
      opened: number;
      clicked: number;
      bounced: number;
    };
  };
  dateRange?: string;
}

export function MetricsCards({
  metrics = {
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
  },
  dateRange = "últimos 30 días",
}: MetricsCardsProps) {
  // Calcular tasas
  const openRate = ((metrics.opened / metrics.sent) * 100).toFixed(1);
  const clickRate = ((metrics.clicked / metrics.sent) * 100).toFixed(1);
  const bounceRate = ((metrics.bounced / metrics.sent) * 100).toFixed(1);

  // Calcular tendencias
  const calculateTrend = (current: number, previous: number) => {
    if (!previous) return { value: 0, direction: "neutral" as const, label: dateRange };
    const change = ((current - previous) / previous) * 100;
    return {
      value: Number(change.toFixed(1)),
      direction: change > 0 ? "up" as const : change < 0 ? "down" as const : "neutral" as const,
      label: dateRange,
    };
  };

  const cardsData = [
    {
      title: "Emails enviados",
      value: metrics.sent.toLocaleString(),
      subtitle: `${openRate}% tasa de apertura`,
      trend: calculateTrend(metrics.sent, metrics.previousPeriod?.sent || 0),
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      iconBgColor: "bg-[#E6F9F0]",
      iconColor: "text-[#00D26A]",
    },
    {
      title: "Tasa de apertura",
      value: `${openRate}%`,
      subtitle: `${metrics.opened.toLocaleString()} emails abiertos`,
      trend: calculateTrend(metrics.opened, metrics.previousPeriod?.opened || 0),
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      iconBgColor: "bg-[#EEF2FF]",
      iconColor: "text-[#6366F1]",
    },
    {
      title: "Tasa de clics",
      value: `${clickRate}%`,
      subtitle: `${metrics.clicked.toLocaleString()} clics totales`,
      trend: calculateTrend(metrics.clicked, metrics.previousPeriod?.clicked || 0),
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
      ),
      iconBgColor: "bg-[#FEF3C7]",
      iconColor: "text-[#F59E0B]",
    },
    {
      title: "Tasa de rebote",
      value: `${bounceRate}%`,
      subtitle: `${metrics.bounced.toLocaleString()} emails rebotados`,
      trend: calculateTrend(metrics.bounced, metrics.previousPeriod?.bounced || 0),
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      iconBgColor: "bg-[#FEE2E2]",
      iconColor: "text-[#EF4444]",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cardsData.map((card, index) => (
        <MetricCard key={index} {...card} />
      ))}
    </div>
  );
}
