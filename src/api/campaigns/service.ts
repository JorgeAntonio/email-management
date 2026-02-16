import { emailApi, type ApiClient } from "../core/api-client";
import type { IResApi, PaginatedResponse } from "../core/types";

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  preheader?: string;
  status: "draft" | "scheduled" | "sending" | "sent" | "paused" | "cancelled";
  content?: string;
  templateId?: string;
  senderId?: string;
  recipients: number;
  sentAt?: string;
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignDto {
  name: string;
  subject: string;
  preheader?: string;
  content?: string;
  templateId?: string;
  senderId?: string;
  recipientListIds?: string[];
  scheduledAt?: string;
}

export interface CampaignStats {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number;
}

class CampaignsService {
  private client: ApiClient;

  constructor() {
    this.client = emailApi;
  }

  async getCampaigns(page = 1, limit = 10, status?: string): Promise<IResApi<PaginatedResponse<Campaign>>> {
    let query = `?page=${page}&limit=${limit}`;
    if (status) {
      query += `&status=${status}`;
    }
    const response = await this.client.get<PaginatedResponse<Campaign>>(query);
    
    return {
      status: response.status,
      data: response.data,
      errors: response.errors,
    };
  }

  async getCampaign(id: string): Promise<IResApi<Campaign>> {
    const response = await this.client.get<Campaign>(`/${id}`);
    
    return {
      status: response.status,
      data: response.data,
      errors: response.errors,
    };
  }

  async createCampaign(data: CreateCampaignDto): Promise<IResApi<Campaign>> {
    const response = await this.client.post<Campaign>("", data);
    
    return {
      status: response.status,
      data: response.data,
      errors: response.errors,
    };
  }

  async updateCampaign(id: string, data: Partial<CreateCampaignDto>): Promise<IResApi<Campaign>> {
    const response = await this.client.patch<Campaign>(`/${id}`, data);
    
    return {
      status: response.status,
      data: response.data,
      errors: response.errors,
    };
  }

  async deleteCampaign(id: string): Promise<IResApi<{ success: boolean }>> {
    const response = await this.client.delete<{ success: boolean }>(`/${id}`);
    
    return {
      status: response.status,
      data: response.data,
      errors: response.errors,
    };
  }

  async sendCampaign(id: string): Promise<IResApi<Campaign>> {
    const response = await this.client.post<Campaign>(`/${id}/send`);
    
    return {
      status: response.status,
      data: response.data,
      errors: response.errors,
    };
  }

  async scheduleCampaign(id: string, scheduledAt: string): Promise<IResApi<Campaign>> {
    const response = await this.client.post<Campaign>(`/${id}/schedule`, { scheduledAt });
    
    return {
      status: response.status,
      data: response.data,
      errors: response.errors,
    };
  }

  async getCampaignStats(id: string): Promise<IResApi<CampaignStats>> {
    const response = await this.client.get<CampaignStats>(`/${id}/stats`);
    
    return {
      status: response.status,
      data: response.data,
      errors: response.errors,
    };
  }
}

export const campaignsService = new CampaignsService();
