import { AppSidebar } from '@/components/layout/app-sidebar';
import { TopHeader } from '@/components/layout/top-header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopHeader />
      <div className="flex flex-1">
        <AppSidebar />
        <main className="flex-1 ml-64 p-8">{children}</main>
      </div>
    </div>
  );
}
