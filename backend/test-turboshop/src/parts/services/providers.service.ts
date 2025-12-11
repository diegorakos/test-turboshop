import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PartDTO, ProviderOfferDTO } from '../dtos/part.dto';

const PROVIDER_BASE_URL =
  process.env.PROVIDER_BASE_URL ||
  'https://web-production-84144.up.railway.app';

@Injectable()
export class ProvidersService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: PROVIDER_BASE_URL,
      timeout: 10000,
    });
  }

  // ============ AutoPartsPlus ============
  async getAutoPartsPlusCatalog(
    page: number = 1,
    limit: number = 20,
  ): Promise<PartDTO[]> {
    try {
      const response = await this.client.get(
        '/api/autopartsplus/catalog?page=' + page + '&limit=' + limit,
      );
      return response.data.map((item: any) =>
        this.normalizeAutoPartsPlus(item),
      );
    } catch (error) {
      console.error('AutoPartsPlus catalog error:', error);
      return [];
    }
  }

  async getAutoPartsPlusPart(sku: string): Promise<PartDTO | null> {
    try {
      const response = await this.client.get(
        `/api/autopartsplus/parts?sku=${sku}`,
      );
      return this.normalizeAutoPartsPlus(response.data);
    } catch (error) {
      console.error(`AutoPartsPlus part ${sku} error:`, error);
      return null;
    }
  }

  private normalizeAutoPartsPlus(data: any): PartDTO {
    return {
      sku: data.sku || data.id,
      name: data.name || data.partName || '',
      description: data.description,
      price: parseFloat(data.price) || 0,
      stock: parseInt(data.stock) || 0,
      brand: data.brand || data.manufacturer,
      model: data.model,
      year: data.year ? parseInt(data.year) : undefined,
      image: data.image,
      category: data.category,
      providers: [
        {
          provider: 'AutoPartsPlus',
          price: parseFloat(data.price) || 0,
          stock: parseInt(data.stock) || 0,
          providerSku: data.sku || data.id,
          lastUpdated: new Date(),
        },
      ],
    };
  }

  // ============ RepuestosMax ============
  async getRepuestosMaxCatalog(
    pagina: number = 1,
    limite: number = 20,
  ): Promise<PartDTO[]> {
    try {
      const response = await this.client.get(
        '/api/repuestosmax/catalogo?pagina=' + pagina + '&limite=' + limite,
      );
      return response.data.map((item: any) => this.normalizeRepuestosMax(item));
    } catch (error) {
      console.error('RepuestosMax catalog error:', error);
      return [];
    }
  }

  async getRepuestosMaxPart(codigo: string): Promise<PartDTO | null> {
    try {
      const response = await this.client.get(
        `/api/repuestosmax/productos?codigo=${codigo}`,
      );
      return this.normalizeRepuestosMax(response.data);
    } catch (error) {
      console.error(`RepuestosMax part ${codigo} error:`, error);
      return null;
    }
  }

  private normalizeRepuestosMax(data: any): PartDTO {
    return {
      sku: data.codigo || data.id,
      name: data.nombre || data.producto || '',
      description: data.descripcion || data.description,
      price: parseFloat(data.precio) || parseFloat(data.price) || 0,
      stock: parseInt(data.stock) || parseInt(data.disponibilidad) || 0,
      brand: data.marca || data.brand,
      model: data.modelo || data.model,
      year: data.año ? parseInt(data.año) : undefined,
      image: data.imagen || data.image,
      category: data.categoria || data.category,
      providers: [
        {
          provider: 'RepuestosMax',
          price: parseFloat(data.precio) || parseFloat(data.price) || 0,
          stock: parseInt(data.stock) || parseInt(data.disponibilidad) || 0,
          providerSku: data.codigo || data.id,
          lastUpdated: new Date(),
        },
      ],
    };
  }

  // ============ GlobalParts ============
  async getGlobalPartsCatalog(
    page: number = 1,
    itemsPerPage: number = 20,
  ): Promise<PartDTO[]> {
    try {
      const response = await this.client.get(
        '/api/globalparts/inventory/catalog?page=' +
          page +
          '&itemsPerPage=' +
          itemsPerPage,
      );
      return response.data.map((item: any) => this.normalizeGlobalParts(item));
    } catch (error) {
      console.error('GlobalParts catalog error:', error);
      return [];
    }
  }

  async getGlobalPartsPart(partNumber: string): Promise<PartDTO | null> {
    try {
      const response = await this.client.get(
        `/api/globalparts/inventory/search?partNumber=${partNumber}`,
      );
      return this.normalizeGlobalParts(response.data);
    } catch (error) {
      console.error(`GlobalParts part ${partNumber} error:`, error);
      return null;
    }
  }

  private normalizeGlobalParts(data: any): PartDTO {
    return {
      sku: data.partNumber || data.id,
      name: data.description || data.name || '',
      description: data.fullDescription || data.description,
      price: parseFloat(data.unitPrice) || parseFloat(data.price) || 0,
      stock:
        parseInt(data.quantityAvailable) ||
        parseInt(data.stock) ||
        parseInt(data.quantity) ||
        0,
      brand: data.manufacturer || data.brand,
      model: data.model || data.type,
      year: data.year ? parseInt(data.year) : undefined,
      image: data.image || data.thumbnail,
      category: data.category || data.type,
      providers: [
        {
          provider: 'GlobalParts',
          price: parseFloat(data.unitPrice) || parseFloat(data.price) || 0,
          stock:
            parseInt(data.quantityAvailable) ||
            parseInt(data.stock) ||
            parseInt(data.quantity) ||
            0,
          providerSku: data.partNumber || data.id,
          lastUpdated: new Date(),
        },
      ],
    };
  }
}
