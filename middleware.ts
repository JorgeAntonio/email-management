import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

// Definición de rutas protegidas y sus roles requeridos
const routePermissions: Record<string, string[]> = {
  // Rutas de administración
  "/admin": ["super_admin", "admin"],
  "/admin/users": ["super_admin", "admin"],
  "/admin/roles": ["super_admin"],
  "/admin/settings": ["super_admin", "admin"],
  
  // Rutas de gestión
  "/dashboard": [], // Solo requiere autenticación
  "/campaigns": [],
  "/campaigns/create": ["campaigns:create"],
  "/campaigns/edit": ["campaigns:update"],
  "/campaigns/delete": ["campaigns:delete"],
  "/audience": [],
  "/audience/import": ["audience:import"],
  "/audience/export": ["audience:export"],
  "/analytics": [],
  "/templates": [],
  "/templates/create": ["templates:create"],
  "/templates/edit": ["templates:update"],
  "/templates/delete": ["templates:delete"],
  "/settings": ["settings:read"],
  "/settings/edit": ["settings:update"],
};

// Rutas públicas que no requieren autenticación
const publicRoutes = ["/", "/login", "/register", "/forgot-password", "/reset-password", "/auth/callback"];

// Verifica si una ruta requiere permisos específicos
function getRequiredPermissions(pathname: string): string[] | null {
  // Verificar coincidencia exacta primero
  if (routePermissions[pathname]) {
    return routePermissions[pathname];
  }

  // Verificar coincidencia de prefijo
  for (const [route, permissions] of Object.entries(routePermissions)) {
    if (pathname.startsWith(route)) {
      return permissions;
    }
  }

  return null;
}

// Verifica si es una ruta pública
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some((route) => pathname === route || pathname.startsWith(route));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Crear una respuesta inicial
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Crear cliente de Supabase
  const supabase = createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Obtener el usuario actual
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  // Si es una ruta pública, permitir acceso
  if (isPublicRoute(pathname)) {
    // Si el usuario está logueado y trata de acceder a login/register, redirigir al dashboard
    if (user && (pathname === "/login" || pathname === "/register")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return response;
  }

  // Si no hay usuario y no es ruta pública, redirigir a login
  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verificar permisos específicos de la ruta
  const requiredPermissions = getRequiredPermissions(pathname);

  if (requiredPermissions && requiredPermissions.length > 0) {
    // Verificar si tiene alguno de los roles requeridos
    const { data: hasRole, error: roleError } = await supabase.rpc("has_any_role", {
      user_uuid: user.id,
      role_names: requiredPermissions,
    });

    if (roleError || !hasRole) {
      // Verificar si tiene alguno de los permisos específicos requeridos
      let hasPermission = false;
      
      for (const permission of requiredPermissions) {
        if (permission.includes(":")) {
          const { data: permCheck } = await supabase.rpc("has_permission", {
            user_uuid: user.id,
            permission_name: permission,
          });
          if (permCheck) {
            hasPermission = true;
            break;
          }
        }
      }

      if (!hasPermission) {
        // Usuario no tiene permisos, redirigir a página de acceso denegado o dashboard
        return NextResponse.redirect(new URL("/dashboard?error=unauthorized", request.url));
      }
    }
  }

  // Obtener información del usuario para pasarla a los headers (opcional)
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single();

  // Añadir headers con información del usuario para uso en Server Components
  if (profile) {
    response.headers.set("x-user-id", user.id);
    response.headers.set("x-user-email", user.email || "");
    response.headers.set("x-user-name", profile.full_name || "");
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (handled separately)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/).*)",
  ],
};
