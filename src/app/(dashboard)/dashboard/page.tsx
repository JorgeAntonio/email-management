import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Crown, MessageSquare, Settings } from 'lucide-react';
import { Suspense } from 'react';
import 'react-calendar/dist/Calendar.css';
import { CalendarWidget } from '../../../modules/dashboard/components/calendar-widget';
import { OnboardingSteps } from '../../../modules/dashboard/components/onboarding-steps';
import { UsagePlan } from '../../../modules/dashboard/components/usage-plan';

function UsageSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Skeleton className="h-40" />
      <Skeleton className="lg:col-span-2 h-40" />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#1A1A1A]">
          Hola, Jorge Antonio
        </h1>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="gap-2 text-[#6366F1] border-[#6366F1]"
          >
            <Settings className="h-4 w-4" />
            Personalizar página
          </Button>
          <Button className="gap-2 bg-[#1A1A1A] hover:bg-[#374151]">
            <Crown className="h-4 w-4" />
            Actualizar ahora
          </Button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <Suspense fallback={<Skeleton className="h-64" />}>
          <CalendarWidget />
        </Suspense>
        <Suspense fallback={<Skeleton className="lg:col-span-2 h-64" />}>
          <OnboardingSteps />
        </Suspense>
      </div>

      <Suspense fallback={<UsageSkeleton />}>
        <UsagePlan />
      </Suspense>

      <Card className="border-[#E5E7EB]">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="h-20 w-20 rounded-lg bg-[#E6F9F0] flex items-center justify-center">
                <MessageSquare className="h-10 w-10 text-[#00D26A]" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[#1A1A1A] mb-2">
                Conversa con tus clientes en su canal de comunicación preferido
              </h3>
              <p className="text-sm text-[#6B7280]">
                Amplía tu alcance y acerca a tus contactos a la compra con
                campañas multicanal: email, SMS, WhatsApp y notificaciones push.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
