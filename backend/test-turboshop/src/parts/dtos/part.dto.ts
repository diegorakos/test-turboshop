// Unified part DTO - normalized format for all providers
export class PartDTO {
  sku: string; // Unique identifier
  name: string;
  description?: string;
  price: number;
  stock: number;
  brand?: string;
  model?: string;
  year?: number;
  providers: ProviderOfferDTO[]; // Offers from different providers
  image?: string;
  category?: string;
}

export class ProviderOfferDTO {
  provider: string; // 'AutoPartsPlus' | 'RepuestosMax' | 'GlobalParts'
  price: number;
  stock: number;
  providerSku?: string; // Original SKU from provider
  lastUpdated: Date;
}

export class CatalogResponseDTO {
  parts: PartDTO[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}
