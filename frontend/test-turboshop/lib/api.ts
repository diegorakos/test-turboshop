import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export interface ProviderOffer {
  provider: string;
  price: number;
  stock: number;
  providerSku?: string;
  lastUpdated: string;
}

export interface Part {
  sku: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  brand?: string;
  model?: string;
  year?: number;
  providers: ProviderOffer[];
  image?: string;
  category?: string;
}

export interface CatalogResponse {
  parts: Part[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export const partsAPI = {
  getCatalog: async (
    page: number = 1,
    limit: number = 20,
    search?: string,
    filters?: { carBrand?: string; carModel?: string; carYear?: number }
  ): Promise<CatalogResponse> => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (search) params.append("search", search);
    if (filters?.carBrand) params.append("carBrand", filters.carBrand);
    if (filters?.carModel) params.append("carModel", filters.carModel);
    if (filters?.carYear) params.append("carYear", String(filters.carYear));

    const response = await apiClient.get<CatalogResponse>(
      `/parts/catalog?${params}`
    );
    return response.data;
  },

  getPart: async (sku: string): Promise<Part> => {
    const response = await apiClient.get<Part>(`/parts/${sku}`);
    return response.data;
  },
};
