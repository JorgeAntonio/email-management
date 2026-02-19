import { analyticsApi, type ApiClient } from "../core/api-client";
import type { IResApi, PaginatedResponse } from "../core/types";

export interface CampaignMetrics {
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
}

export interface Campaign {
  id: string;
  name: string;
  status: "draft" | "scheduled" | "sending" | "sent" | "paused";
  subject: string;
  sentAt?: string;
  scheduledAt?: string;
  createdAt: string;
  recipients: number;
  openRate?: number;
  clickRate?: number;
}

export interface AnalyticsSummary {
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
  totalBounced: number;
  openRate: number;
  clickRate: number;
}

class AnalyticsService {
  private client: ApiClient;

  constructor() {
    this.client = analyticsApi;
  }

  async getMetrics(dateRange?: string): Promise<IResApi<CampaignMetrics>> {
    const query = dateRange ? `?range=${dateRange}` : "";
    const response = await this.client.get<CampaignMetrics>(`/metrics${query}`);
    
    return {
      status: response.status,
      data: response.data,
      errors: response.errors,
    };
  }

  async getCampaigns(page = 1, limit = 10): Promise<IResApi<PaginatedResponse<Campaign>>> {
    const response = await this.client.get<PaginatedResponse<Campaign>>(
      `/campaigns?page=${page}&limit=${limit}`
    );
    
    return {
      status: response.status,
      data: response.data,
      errors: response.errors,
    };
  }

  async getSummary(): Promise<IResApi<AnalyticsSummary>> {
    const response = await this.client.get<AnalyticsSummary>("/summary");
    
    return {
      status: response.status,
      data: response.data,
      errors: response.errors,
    };
  }
}

export const analyticsService = new AnalyticsService();
