'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Bell,
  ChevronDown,
  HelpCircle,
  LayoutGrid,
  LogOut,
  Settings,
  Sparkles,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export function TopHeader() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success('Sesión cerrada exitosamente');
      router.push('/login');
      router.refresh();
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  const userInitial = user?.email?.charAt(0).toUpperCase() || 'U';
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E5E7EB] bg-white">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00D26A]">
              <span className="text-lg font-bold text-white">B</span>
            </div>
            <span className="text-xl font-bold text-[#1A1A1A]">Brevo</span>
          </Link>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Ask AI Button */}
          <Button
            variant="outline"
            className="gap-2 border-[#E5E7EB] bg-[#EEF2FF] text-[#6366F1] hover:bg-[#E0E7FF]"
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Preguntar a IA</span>
          </Button>

          {/* Usage & Plan */}
          <Button
            variant="ghost"
            className="gap-2 text-[#6B7280] hover:text-[#1A1A1A]"
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden sm:inline">Uso y plan</span>
          </Button>

          {/* Help */}
          <Link href="/dashboard/help">
            <Button
              variant="ghost"
              size="icon"
              className="text-[#6B7280] hover:text-[#1A1A1A]"
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
          </Link>

          {/* Settings */}
          <Link href="/dashboard/settings">
            <Button
              variant="ghost"
              size="icon"
              className="text-[#6B7280] hover:text-[#1A1A1A]"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </Link>

          {/* Notifications */}
          <Link href="/dashboard/notifications">
            <Button
              variant="ghost"
              size="icon"
              className="text-[#6B7280] hover:text-[#1A1A1A] relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#EF4444] text-[10px] font-medium text-white flex items-center justify-center">
                3
              </span>
            </Button>
          </Link>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 pl-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-[#00D26A] text-white text-sm font-medium">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline text-sm font-medium text-[#1A1A1A]">
                  {userName}
                </span>
                <ChevronDown className="h-4 w-4 text-[#6B7280]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Configuración
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="text-[#EF4444] cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
