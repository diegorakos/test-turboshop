import { Injectable } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import {
  PartDTO,
  CatalogResponseDTO,
  ProviderOfferDTO,
} from '../dtos/part.dto';

@Injectable()
export class PartsService {
  private partsCache: Map<string, { data: PartDTO; timestamp: number }> =
    new Map();
  private catalogCache: { data: PartDTO[]; timestamp: number } | null = null;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor(private providersService: ProvidersService) {}

  async getCatalog(
    page: number = 1,
    limit: number = 20,
    search?: string,
    filters?: { brand?: string; model?: string; year?: number },
  ): Promise<CatalogResponseDTO> {
    // Get all parts from all providers
    const allParts = await this.getAllParts();

    // Apply search and filters
    let filtered = allParts;
    if (search) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (part) =>
          part.name.toLowerCase().includes(query) ||
          part.description?.toLowerCase().includes(query) ||
          part.sku.toLowerCase().includes(query),
      );
    }

    if (filters) {
      if (filters.brand) {
        filtered = filtered.filter((part) =>
          part.brand?.toLowerCase().includes(filters.brand!.toLowerCase()),
        );
      }
      if (filters.model) {
        filtered = filtered.filter((part) =>
          part.model?.toLowerCase().includes(filters.model!.toLowerCase()),
        );
      }
      if (filters.year) {
        filtered = filtered.filter((part) => part.year === filters.year);
      }
    }

    // Paginate
    const total = filtered.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const parts = filtered.slice(start, end);

    return {
      parts,
      page,
      limit,
      total,
      hasMore: end < total,
    };
  }

  async getPart(sku: string): Promise<PartDTO | null> {
    // Check cache
    const cached = this.partsCache.get(sku);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    // Try to find part from all providers
    const [autoparts, repuestos, globalparts] = await Promise.all([
      this.providersService.getAutoPartsPlusPart(sku),
      this.providersService.getRepuestosMaxPart(sku),
      this.providersService.getGlobalPartsPart(sku),
    ]);

    const parts = [autoparts, repuestos, globalparts].filter((p) => p !== null);

    if (parts.length === 0) {
      return null;
    }

    // Merge all provider offers for the same part
    const mergedPart = this.mergeParts(parts);
    this.partsCache.set(sku, { data: mergedPart, timestamp: Date.now() });

    return mergedPart;
  }

  private async getAllParts(): Promise<PartDTO[]> {
    // Check cache
    if (
      this.catalogCache &&
      Date.now() - this.catalogCache.timestamp < this.CACHE_TTL
    ) {
      return this.catalogCache.data;
    }

    // Fetch from all providers
    const [autoparts, repuestos, globalparts] = await Promise.all([
      this.providersService.getAutoPartsPlusCatalog(1, 100),
      this.providersService.getRepuestosMaxCatalog(1, 100),
      this.providersService.getGlobalPartsCatalog(1, 100),
    ]);

    // Merge parts by SKU
    const partMap = new Map<string, PartDTO>();

    [autoparts, repuestos, globalparts].forEach((list) => {
      list.forEach((part) => {
        if (partMap.has(part.sku)) {
          const existing = partMap.get(part.sku)!;
          this.mergeMetadata(existing, part);
          existing.providers.push(...part.providers);
          // Update price and stock with best offer (only from providers with stock)
          const availableProviders = existing.providers.filter(
            (p) => p.stock > 0,
          );
          const prices =
            availableProviders.length > 0
              ? availableProviders.map((p) => p.price)
              : existing.providers.map((p) => p.price);
          const stocks = existing.providers.map((p) => p.stock);
          existing.price = prices.length > 0 ? Math.min(...prices) : 0;
          existing.stock = Math.max(...stocks);
        } else {
          partMap.set(part.sku, { ...part, providers: [...part.providers] });
        }
      });
    });

    const allParts = Array.from(partMap.values());
    this.catalogCache = { data: allParts, timestamp: Date.now() };

    return allParts;
  }

  private mergeMetadata(target: PartDTO, source: PartDTO): void {
    if (!target.name && source.name) {
      target.name = source.name;
    }
    if (
      source.description &&
      (!target.description ||
        source.description.length > target.description.length)
    ) {
      target.description = source.description;
    }
    if (!target.brand && source.brand) {
      target.brand = source.brand;
    }
    if (!target.model && source.model) {
      target.model = source.model;
    }
    if (!target.year && source.year) {
      target.year = source.year;
    }
    if (!target.image && source.image) {
      target.image = source.image;
    }
    if (!target.category && source.category) {
      target.category = source.category;
    }
  }

  private mergeParts(parts: PartDTO[]): PartDTO {
    if (parts.length === 0) {
      throw new Error('No parts to merge');
    }

    const merged: PartDTO = { ...parts[0], providers: [] };
    const providers: ProviderOfferDTO[] = [];

    parts.forEach((part) => {
      this.mergeMetadata(merged, part);
      providers.push(...part.providers);
    });

    // Only calculate price from providers that have stock
    const availableProviders = providers.filter((p) => p.stock > 0);
    const prices =
      availableProviders.length > 0
        ? availableProviders.map((p) => p.price)
        : providers.map((p) => p.price);
    const stocks = providers.map((p) => p.stock);

    return {
      ...merged,
      price: prices.length > 0 ? Math.min(...prices) : 0,
      stock: Math.max(...stocks),
      providers: providers.sort((a, b) => a.price - b.price),
    };
  }

  clearCache() {
    this.partsCache.clear();
    this.catalogCache = null;
  }
}
