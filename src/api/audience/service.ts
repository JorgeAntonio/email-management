import { crmApi, type ApiClient } from "../core/api-client";
import type { IResApi, PaginatedResponse } from "../core/types";

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  type: "estudiante" | "docente" | "administrativo" | "externo" | "general";
  group: string;
  enrollmentStatus?: "matriculado" | "no_matriculado" | "egresado" | "pendiente";
  promotion?: string;
  career?: string;
  semester?: number;
  tags?: string[];
  customFields?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ContactList {
  id: string;
  name: string;
  description?: string;
  contactCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Segment {
  id: string;
  name: string;
  description?: string;
  filters: SegmentFilter[];
  contactCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SegmentFilter {
  field: string;
  operator: "equals" | "not_equals" | "contains" | "not_contains" | "greater_than" | "less_than" | "in" | "not_in";
  value: unknown;
}

export interface CreateContactDto {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  type: Contact["type"];
  group?: string;
  tags?: string[];
  customFields?: Record<string, unknown>;
}

class AudienceService {
  private client: ApiClient;

  constructor() {
    this.client = crmApi;
  }

  async getContacts(page = 1, limit = 50, filters?: Record<string, unknown>): Promise<IResApi<PaginatedResponse<Contact>>> {
    let query = `?page=${page}&limit=${limit}`;
    if (filters) {
      query += `&filters=${encodeURIComponent(JSON.stringify(filters))}`;
    }
    const response = await this.client.get<PaginatedResponse<Contact>>(`/contacts${query}`);
    
    return {
      status: response.status,
      data: response.data,
      errors: response.errors,
    };
  }

  async getContact(id: string): Promise<IResApi<Contact>> {
    const response = await this.client.get<Contact>(`/contacts/${id}`);
    
    return {
      status: response.status,
      data: response.data,
      errors: response.errors,
    };
  }

  async createContact(data: CreateContactDto): Promise<IResApi<Contact>> {
    const response = await this.client.post<Contact>("/contacts", data);
    
    return {
      status: response.status,
      data: response.data,
      errors: response.errors,
    };
  }

  async updateContact(id: string, data: Partial<CreateContactDto>): Promise<IResApi<Contact>> {
    const response = await this.client.patch<Contact>(`/contacts/${id}`, data);
    
    return {
      status: response.status,
      data: response.data,
      errors: response.errors,
    };
  }

  async deleteContact(id: string): Promise<IResApi<{ success: boolean }>> {
    const response = await this.client.delete<{ success: boolean }>(`/contacts/${id}`);
    
    return {
      status: response.status,
      data: response.data,
      errors: response.errors,
    };
  }

  async importContacts(contacts: CreateContactDto[]): Promise<IResApi<{ imported: number; errors: string[] }>> {
    const response = await this.client.post<{ imported: number; errors: string[] }>("/contacts/import", { contacts });
    
    return {
      status: response.status,
      data: response.data,
      errors: response.errors,
    };
  }

  async getLists(): Promise<IResApi<ContactList[]>> {
    const response = await this.client.get<ContactList[]>("/lists");
    
    return {
      status: response.status,
      data: response.data,
      errors: response.errors,
    };
  }

  async createList(name: string, description?: string): Promise<IResApi<ContactList>> {
    const response = await this.client.post<ContactList>("/lists", { name, description });
    
    return {
      status: response.status,
      data: response.data,
      errors: response.errors,
    };
  }

  async getSegments(): Promise<IResApi<Segment[]>> {
    const response = await this.client.get<Segment[]>("/segments");
    
    return {
      status: response.status,
      data: response.data,
      errors: response.errors,
    };
  }

  async createSegment(name: string, filters: SegmentFilter[]): Promise<IResApi<Segment>> {
    const response = await this.client.post<Segment>("/segments", { name, filters });
    
    return {
      status: response.status,
      data: response.data,
      errors: response.errors,
    };
  }
}

export const audienceService = new AudienceService();
