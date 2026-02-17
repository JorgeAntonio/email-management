import { cookies } from "next/headers";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiClientConfig {
  baseUrl: string;
  appToken: string;
}

const MODULES_CONFIG: Record<string, ApiClientConfig> = {
  EMAIL: {
    baseUrl: process.env.EMAIL_API_URL || "http://localhost:3001",
    appToken: process.env.EMAIL_API_TOKEN || "",
  },
  CRM: {
    baseUrl: process.env.CRM_API_URL || "http://localhost:3002",
    appToken: process.env.CRM_API_TOKEN || "",
  },
  ANALYTICS: {
    baseUrl: process.env.ANALYTICS_API_URL || "http://localhost:3003",
    appToken: process.env.ANALYTICS_API_TOKEN || "",
  },
};

export function getModuleConfig(module: keyof typeof MODULES_CONFIG) {
  return MODULES_CONFIG[module];
}

export async function buildHeaders(module: keyof typeof MODULES_CONFIG): Promise<Record<string, string>> {
  const config = getModuleConfig(module);
  const cookieStore = await cookies();
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "app-token": config.appToken,
  };

  const sessionCookie = cookieStore.get("email_session");
  if (sessionCookie) {
    try {
      const sessionData = JSON.parse(sessionCookie.value);
      if (sessionData.token) {
        headers["Authorization"] = `Bearer ${sessionData.token}`;
      }
      if (sessionData.userId) {
        headers["user-token"] = sessionData.userId;
      }
    } catch {
      // Invalid session cookie, continue without auth
    }
  }

  return headers;
}

export class ApiClient {
  private module: keyof typeof MODULES_CONFIG;

  constructor(module: keyof typeof MODULES_CONFIG) {
    this.module = module;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ ok: boolean; status: number; data?: T; errors?: string[] }> {
    const config = getModuleConfig(this.module);
    const headers = await buildHeaders(this.module);

    const url = `${config.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      const contentType = response.headers.get("content-type");
      let data: T | undefined;
      let errors: string[] | undefined;

      if (contentType?.includes("application/json")) {
        const json = await response.json();
        data = json.data;
        errors = json.errors;
      }

      return {
        ok: response.ok,
        status: response.status,
        data,
        errors,
      };
    } catch (error) {
      console.error(`API Error [${this.module}]:`, error);
      return {
        ok: false,
        status: 500,
        errors: ["Error de conexión con el servidor"],
      };
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<{ ok: boolean; status: number; data?: T; errors?: string[] }> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(endpoint: string, body?: unknown): Promise<{ ok: boolean; status: number; data?: T; errors?: string[] }> {
    return this.request<T>(endpoint, { method: "POST", body: body as BodyInit });
  }

  async put<T>(endpoint: string, body?: unknown): Promise<{ ok: boolean; status: number; data?: T; errors?: string[] }> {
    return this.request<T>(endpoint, { method: "PUT", body: body as BodyInit });
  }

  async patch<T>(endpoint: string, body?: unknown): Promise<{ ok: boolean; status: number; data?: T; errors?: string[] }> {
    return this.request<T>(endpoint, { method: "PATCH", body: body as BodyInit });
  }

  async delete<T>(endpoint: string): Promise<{ ok: boolean; status: number; data?: T; errors?: string[] }> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const emailApi = new ApiClient("EMAIL");
export const crmApi = new ApiClient("CRM");
export const analyticsApi = new ApiClient("ANALYTICS");
