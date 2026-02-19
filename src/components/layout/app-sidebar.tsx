'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  ArrowLeftRight,
  ChevronDown,
  Crown,
  FileText,
  Globe,
  Home,
  List,
  MessageSquare,
  PieChart,
  Send,
  ShoppingCart,
  Target,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
  badge?: string;
  children?: NavItem[];
  premium?: boolean;
}

const navigation: NavItem[] = [
  {
    title: 'Inicio',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'Envíos',
    url: '/dashboard/send',
    icon: Send,
  },
  {
    title: 'CRM',
    url: '/dashboard/crm',
    icon: Target,
    children: [
      { title: 'Todos los contactos', url: '/dashboard/crm', icon: Users },
      { title: 'Listas', url: '/dashboard/crm/lists', icon: List },
      { title: 'Segmentos', url: '/dashboard/crm/segments', icon: PieChart },
      { title: 'Leads', url: '/dashboard/crm/leeds', icon: Target },
    ],
  },
  {
    title: 'Marketing',
    url: '/dashboard/campaigns',
    icon: Zap,
    children: [
      { title: 'Campañas', url: '/dashboard/campaigns', icon: Target },
      {
        title: 'Landing pages',
        url: '/dashboard/landing-pages',
        icon: FileText,
        premium: true,
      },
      { title: 'Formularios', url: '/dashboard/forms', icon: FileText },
      { title: 'Estadísticas', url: '/dashboard/analytics', icon: PieChart },
      { title: 'Plantillas', url: '/dashboard/templates', icon: FileText },
    ],
  },
  {
    title: 'Historial',
    url: '/dashboard/history',
    icon: FileText,
  },
  {
    title: 'Automatizaciones',
    url: '/dashboard/automations',
    icon: Zap,
  },
  {
    title: 'Explorador APIs',
    url: '/dashboard/api-explorer',
    icon: Globe,
  },
  {
    title: 'Transaccional',
    url: '/dashboard/transactional',
    icon: ArrowLeftRight,
  },
  {
    title: 'Conversaciones',
    url: '/dashboard/conversations',
    icon: MessageSquare,
  },
  {
    title: 'Comercio',
    url: '/dashboard/commerce',
    icon: ShoppingCart,
  },
];

function NavItemComponent({
  item,
  expanded,
  onToggle,
  pathname,
}: {
  item: NavItem;
  expanded: boolean;
  onToggle: () => void;
  pathname: string;
}) {
  const Icon = item.icon;
  const hasChildren = item.children && item.children.length > 0;
  const isActive = pathname === item.url || pathname.startsWith(item.url + '/');
  const isChildActive = item.children?.some(
    (child) => pathname === child.url || pathname.startsWith(child.url + '/')
  );

  if (hasChildren) {
    return (
      <div className="space-y-1">
        <Button
          variant="ghost"
          onClick={onToggle}
          className={cn(
            'w-full justify-between px-3 py-2 h-10 text-sm font-medium transition-colors',
            isActive || isChildActive
              ? 'bg-[#E6F9F0] text-[#00D26A]'
              : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#1A1A1A]'
          )}
        >
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5" />
            <span>{item.title}</span>
          </div>
          <ChevronDown
            className={cn(
              'h-4 w-4 transition-transform',
              expanded && 'rotate-180'
            )}
          />
        </Button>
        {expanded && (
          <div className="ml-4 pl-4 border-l border-[#E5E7EB] space-y-1">
            {item.children?.map((child) => (
              <Link
                key={child.url}
                href={child.url}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors',
                  pathname === child.url
                    ? 'bg-[#E6F9F0] text-[#00D26A] font-medium'
                    : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#1A1A1A]'
                )}
              >
                <child.icon className="h-4 w-4" />
                <span>{child.title}</span>
                {child.premium && (
                  <Crown className="h-3 w-3 text-[#FBBF24] ml-auto" />
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.url}
      className={cn(
        'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
        isActive
          ? 'bg-[#E6F9F0] text-[#00D26A]'
          : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#1A1A1A]'
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{item.title}</span>
      {item.badge && (
        <span className="ml-auto text-xs bg-[#E6F9F0] text-[#00D26A] px-2 py-0.5 rounded-full">
          {item.badge}
        </span>
      )}
      {item.premium && <Crown className="h-3 w-3 text-[#FBBF24] ml-auto" />}
    </Link>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    '/contacts': pathname.startsWith('/contacts'),
    '/campaigns':
      pathname.startsWith('/campaigns') ||
      pathname.startsWith('/landing') ||
      pathname.startsWith('/forms') ||
      pathname.startsWith('/analytics') ||
      pathname.startsWith('/templates'),
  });

  const toggleItem = (url: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [url]: !prev[url],
    }));
  };

  return (
    <aside className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r border-[#E5E7EB] bg-white overflow-y-auto">
      <nav className="flex flex-col gap-1 p-4">
        {navigation.map((item) => (
          <NavItemComponent
            key={item.url}
            item={item}
            expanded={expandedItems[item.url] || false}
            onToggle={() => toggleItem(item.url)}
            pathname={pathname}
          />
        ))}
      </nav>
    </aside>
  );
}
