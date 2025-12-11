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
      // API returns: { success, parts: [], pagination: {} }
      const parts = response.data.parts || response.data;
      return parts.map((item: any) => this.normalizeAutoPartsPlus(item));
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
      const part = response.data.parts?.[0] || response.data;
      return this.normalizeAutoPartsPlus(part);
    } catch (error) {
      console.error(`AutoPartsPlus part ${sku} error:`, error);
      return null;
    }
  }

  private normalizeAutoPartsPlus(data: any): PartDTO {
    return {
      sku: data.sku || data.part_id,
      name: data.title || data.name || '',
      description: data.desc || data.description,
      price: parseFloat(data.unit_price) || 0,
      stock: parseInt(data.qty_available) || 0,
      brand: data.brand_name || data.brand,
      model: data.model,
      year: data.year ? parseInt(data.year) : undefined,
      image: data.img_urls?.[0] || data.image,
      category: data.category_name || data.category,
      providers: [
        {
          provider: 'AutoPartsPlus',
          price: parseFloat(data.unit_price) || 0,
          stock: parseInt(data.qty_available) || 0,
          providerSku: data.sku || data.part_id,
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
      // API returns: { exito, productos: [], paginacion: {} }
      const productos = response.data.productos || response.data;
      return productos.map((item: any) => this.normalizeRepuestosMax(item));
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
      // API returns: { exito, resultado: { productos: [...] } }
      const producto =
        response.data.resultado?.productos?.[0] ||
        response.data.productos?.[0] ||
        response.data;
      return this.normalizeRepuestosMax(producto);
    } catch (error) {
      console.error(`RepuestosMax part ${codigo} error:`, error);
      return null;
    }
  }

  private normalizeRepuestosMax(data: any): PartDTO {
    const sku = data.identificacion?.sku || data.sku || data.codigo;
    const nombre = data.informacionBasica?.nombre || data.nombre || '';
    const descripcion = data.informacionBasica?.descripcion || data.descripcion;
    const precio = data.precio?.valor || data.precio || 0;
    const cantidad = data.inventario?.cantidad || data.stock || 0;
    const marca = data.informacionBasica?.marca?.nombre || data.marca;
    const categoria =
      data.informacionBasica?.categoria?.nombre || data.categoria;
    const imagen = data.multimedia?.imagenes?.[0]?.url || data.imagen;

    return {
      sku,
      name: nombre,
      description: descripcion,
      price: parseFloat(String(precio)) || 0,
      stock: parseInt(String(cantidad)) || 0,
      brand: marca,
      category: categoria,
      image: imagen,
      providers: [
        {
          provider: 'RepuestosMax',
          price: parseFloat(String(precio)) || 0,
          stock: parseInt(String(cantidad)) || 0,
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
      const response = await this.client.get(
        '/api/globalparts/inventory/catalog?page=' +
          page +
          '&itemsPerPage=' +
          itemsPerPage,
      );
      // API returns: { ResponseEnvelope: { Body: { CatalogListing: { Items: [] } } } }
      const items =
        response.data.ResponseEnvelope?.Body?.CatalogListing?.Items ||
        response.data.items ||
        response.data;
      return items.map((item: any) => this.normalizeGlobalParts(item));
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
      const item =
        response.data.ResponseEnvelope?.Body?.SearchResults?.Items?.[0] ||
        response.data.items?.[0] ||
        response.data;
      return this.normalizeGlobalParts(item);
    } catch (error) {
      console.error(`GlobalParts part ${partNumber} error:`, error);
      return null;
    }
  }

  private normalizeGlobalParts(data: any): PartDTO {
    const sku =
      data.ItemHeader?.ExternalReferences?.SKU?.Value ||
      data.partNumber ||
      data.sku;
    const displayName =
      data.ProductDetails?.NameInfo?.DisplayName ||
      data.description ||
      data.name;
    const description =
      data.ProductDetails?.Description?.FullText ||
      data.fullDescription ||
      data.description;
    const price = data.PricingInfo?.ListPrice?.Amount || data.unitPrice || 0;
    const stock =
      data.AvailabilityInfo?.QuantityInfo?.AvailableQuantity ||
      data.quantityAvailable ||
      data.stock ||
      0;
    const brandName =
      data.ProductDetails?.BrandInfo?.BrandName || data.manufacturer;
    const categoryName =
      data.ProductDetails?.CategoryInfo?.PrimaryCategory?.Name || data.category;
    const imageUrl = data.MediaInfo?.Images?.[0]?.URL || data.image;

    return {
      sku,
      name: displayName,
      description,
      price: parseFloat(String(price)) || 0,
      stock: parseInt(String(stock)) || 0,
      brand: brandName,
      category: categoryName,
      image: imageUrl,
      providers: [
        {
          provider: 'GlobalParts',
          price: parseFloat(String(price)) || 0,
          stock: parseInt(String(stock)) || 0,
          providerSku: sku,
          lastUpdated: new Date(),
        },
      ],
    };
  }
}
