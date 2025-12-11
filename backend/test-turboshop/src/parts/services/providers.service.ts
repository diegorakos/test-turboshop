import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PartDTO } from '../dtos/part.dto';

type AutoPartsPlusItem = {
  sku?: string;
  part_id?: string;
  title?: string;
  name?: string;
  desc?: string;
  description?: string;
  unit_price?: number | string;
  qty_available?: number | string;
  brand_name?: string;
  brand?: string;
  model?: string;
  year?: number | string;
  img_urls?: string[];
  image?: string;
  category_name?: string;
  category?: string;
};

type AutoPartsPlusCatalogResponse = {
  success?: boolean;
  parts?: AutoPartsPlusItem[];
  pagination?: unknown;
};

type RepuestosMaxProducto = {
  identificacion?: { sku?: string };
  sku?: string;
  codigo?: string;
  informacionBasica?: {
    nombre?: string;
    descripcion?: string;
    marca?: { nombre?: string };
    categoria?: { nombre?: string };
  };
  nombre?: string;
  descripcion?: string;
  precio?: { valor?: number | string } | number | string;
  inventario?: { cantidad?: number | string };
  stock?: number | string;
  marca?: string;
  categoria?: string;
  multimedia?: { imagenes?: { url?: string }[] };
  imagen?: string;
};

type RepuestosMaxCatalogResponse = {
  exito?: boolean;
  productos?: RepuestosMaxProducto[];
  paginacion?: unknown;
};

type RepuestosMaxPartResponse = {
  exito?: boolean;
  resultado?: { productos?: RepuestosMaxProducto[] };
  productos?: RepuestosMaxProducto[];
};

type GlobalPartsItem = {
  ItemHeader?: {
    ExternalReferences?: { SKU?: { Value?: string } };
  };
  partNumber?: string;
  sku?: string;
  ProductDetails?: {
    NameInfo?: { DisplayName?: string };
    Description?: { FullText?: string };
    BrandInfo?: { BrandName?: string };
    CategoryInfo?: { PrimaryCategory?: { Name?: string } };
  };
  description?: string;
  name?: string;
  fullDescription?: string;
  PricingInfo?: { ListPrice?: { Amount?: number | string } };
  unitPrice?: number | string;
  AvailabilityInfo?: {
    QuantityInfo?: { AvailableQuantity?: number | string };
  };
  quantityAvailable?: number | string;
  stock?: number | string;
  manufacturer?: string;
  category?: string;
  MediaInfo?: { Images?: { URL?: string }[] };
  image?: string;
};

type GlobalPartsCatalogResponse = {
  ResponseEnvelope?: {
    Body?: { CatalogListing?: { Items?: GlobalPartsItem[] } };
  };
  items?: GlobalPartsItem[];
};

type GlobalPartsSearchResponse = {
  ResponseEnvelope?: {
    Body?: { SearchResults?: { Items?: GlobalPartsItem[] } };
  };
  items?: GlobalPartsItem[];
};

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
      const response = await this.client.get<
        AutoPartsPlusCatalogResponse | AutoPartsPlusItem[]
      >('/api/autopartsplus/catalog?page=' + page + '&limit=' + limit);
      // API returns: { success, parts: [], pagination: {} }
      const parts = Array.isArray(response.data)
        ? response.data
        : (response.data.parts ?? []);
      return parts
        .map((item) => this.normalizeAutoPartsPlus(item))
        .filter(Boolean);
    } catch (error) {
      console.error('AutoPartsPlus catalog error:', error);
      return [];
    }
  }

  async getAutoPartsPlusPart(sku: string): Promise<PartDTO | null> {
    try {
      const response = await this.client.get<
        AutoPartsPlusCatalogResponse | AutoPartsPlusItem | AutoPartsPlusItem[]
      >(`/api/autopartsplus/parts?sku=${sku}`);
      const part = this.extractAutoPartsPlus(response.data);
      return part ? this.normalizeAutoPartsPlus(part) : null;
    } catch (error) {
      console.error(`AutoPartsPlus part ${sku} error:`, error);
      return null;
    }
  }

  private normalizeAutoPartsPlus(data: AutoPartsPlusItem): PartDTO {
    const sku = data.sku || data.part_id || '';
    const name = data.title || data.name || '';
    const description = data.desc || data.description;
    return {
      sku,
      name,
      description,
      price: this.safeNumber(data.unit_price),
      stock: this.safeInteger(data.qty_available),
      brand: data.brand_name || data.brand,
      model: data.model,
      year: data.year !== undefined ? this.safeInteger(data.year) : undefined,
      image: data.img_urls?.[0] || data.image,
      category: data.category_name || data.category,
      providers: [
        {
          provider: 'AutoPartsPlus',
          price: this.safeNumber(data.unit_price),
          stock: this.safeInteger(data.qty_available),
          providerSku: sku,
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
      const response = await this.client.get<
        RepuestosMaxCatalogResponse | RepuestosMaxProducto[]
      >('/api/repuestosmax/catalogo?pagina=' + pagina + '&limite=' + limite);
      // API returns: { exito, productos: [], paginacion: {} }
      const productos = Array.isArray(response.data)
        ? response.data
        : (response.data.productos ?? []);
      return productos
        .map((item) => this.normalizeRepuestosMax(item))
        .filter(Boolean);
    } catch (error) {
      console.error('RepuestosMax catalog error:', error);
      return [];
    }
  }

  async getRepuestosMaxPart(codigo: string): Promise<PartDTO | null> {
    try {
      const response = await this.client.get<RepuestosMaxPartResponse>(
        `/api/repuestosmax/productos?codigo=${codigo}`,
      );
      // API returns: { exito, resultado: { productos: [...] } }
      const producto =
        response.data.resultado?.productos?.[0] || response.data.productos?.[0];
      return producto ? this.normalizeRepuestosMax(producto) : null;
    } catch (error) {
      console.error(`RepuestosMax part ${codigo} error:`, error);
      return null;
    }
  }

  private normalizeRepuestosMax(data: RepuestosMaxProducto): PartDTO {
    const sku = data.identificacion?.sku || data.sku || data.codigo || '';
    const nombre = data.informacionBasica?.nombre || data.nombre || '';
    const descripcion = data.informacionBasica?.descripcion || data.descripcion;
    const precio = this.safeNumber(
      typeof data.precio === 'object' ? data.precio?.valor : data.precio,
    );
    const cantidad = this.safeInteger(
      data.inventario?.cantidad !== undefined
        ? data.inventario.cantidad
        : data.stock,
    );
    const marca = data.informacionBasica?.marca?.nombre || data.marca;
    const categoria =
      data.informacionBasica?.categoria?.nombre || data.categoria;
    const imagen = data.multimedia?.imagenes?.[0]?.url || data.imagen;

    return {
      sku,
      name: nombre,
      description: descripcion,
      price: precio,
      stock: cantidad,
      brand: marca,
      category: categoria,
      image: imagen,
      providers: [
        {
          provider: 'RepuestosMax',
          price: precio,
          stock: cantidad,
          providerSku: sku,
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
      const response = await this.client.get<
        GlobalPartsCatalogResponse | GlobalPartsItem[]
      >(
        '/api/globalparts/inventory/catalog?page=' +
          page +
          '&itemsPerPage=' +
          itemsPerPage,
      );
      // API returns: { ResponseEnvelope: { Body: { CatalogListing: { Items: [] } } } }
      if (Array.isArray(response.data)) {
        return response.data
          .map((item) => this.normalizeGlobalParts(item))
          .filter(Boolean);
      }

      const catalogData = response.data;
      const items =
        catalogData.ResponseEnvelope?.Body?.CatalogListing?.Items ||
        catalogData.items ||
        [];

      return items
        .map((item) => this.normalizeGlobalParts(item))
        .filter(Boolean);
    } catch (error) {
      console.error('GlobalParts catalog error:', error);
      return [];
    }
  }

  async getGlobalPartsPart(partNumber: string): Promise<PartDTO | null> {
    try {
      const response = await this.client.get<
        GlobalPartsSearchResponse | GlobalPartsItem
      >(`/api/globalparts/inventory/search?partNumber=${partNumber}`);
      const item = this.extractGlobalPartsItem(response.data);
      return item ? this.normalizeGlobalParts(item) : null;
    } catch (error) {
      console.error(`GlobalParts part ${partNumber} error:`, error);
      return null;
    }
  }

  private normalizeGlobalParts(data: GlobalPartsItem): PartDTO {
    const sku =
      data.ItemHeader?.ExternalReferences?.SKU?.Value ||
      data.partNumber ||
      data.sku ||
      '';
    const displayName =
      data.ProductDetails?.NameInfo?.DisplayName ||
      data.description ||
      data.name ||
      '';
    const description =
      data.ProductDetails?.Description?.FullText ||
      data.fullDescription ||
      data.description;
    const price = this.safeNumber(
      data.PricingInfo?.ListPrice?.Amount ?? data.unitPrice,
    );
    const stock = this.safeInteger(
      data.AvailabilityInfo?.QuantityInfo?.AvailableQuantity ??
        data.quantityAvailable ??
        data.stock,
    );
    const brandName =
      data.ProductDetails?.BrandInfo?.BrandName || data.manufacturer;
    const categoryName =
      data.ProductDetails?.CategoryInfo?.PrimaryCategory?.Name || data.category;
    const imageUrl = data.MediaInfo?.Images?.[0]?.URL || data.image;

    return {
      sku,
      name: displayName,
      description,
      price,
      stock,
      brand: brandName,
      category: categoryName,
      image: imageUrl,
      providers: [
        {
          provider: 'GlobalParts',
          price,
          stock,
          providerSku: sku,
          lastUpdated: new Date(),
        },
      ],
    };
  }

  private extractAutoPartsPlus(
    source:
      | AutoPartsPlusCatalogResponse
      | AutoPartsPlusItem
      | AutoPartsPlusItem[],
  ): AutoPartsPlusItem | undefined {
    if (Array.isArray(source)) {
      return source[0];
    }
    if ('parts' in source && Array.isArray(source.parts)) {
      return source.parts[0];
    }
    return source as AutoPartsPlusItem;
  }

  private extractGlobalPartsItem(
    source: GlobalPartsSearchResponse | GlobalPartsItem | GlobalPartsItem[],
  ): GlobalPartsItem | undefined {
    if (Array.isArray(source)) {
      return source[0];
    }
    if ('ResponseEnvelope' in source) {
      const result = source.ResponseEnvelope?.Body?.SearchResults?.Items?.[0];
      if (result) {
        return result;
      }
    }
    if ('items' in source && Array.isArray(source.items)) {
      return source.items[0];
    }
    return source as GlobalPartsItem;
  }

  private safeNumber(value: unknown): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private safeInteger(value: unknown): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.trunc(parsed) : 0;
  }
}
