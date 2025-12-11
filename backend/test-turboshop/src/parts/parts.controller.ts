import {
  Controller,
  Get,
  Param,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { PartsService } from './services/parts.service';
import { CatalogResponseDTO } from './dtos/part.dto';

@Controller('api/parts')
export class PartsController {
  constructor(private partsService: PartsService) {}

  @Get('catalog')
  async getCatalog(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('brand') brand?: string,
    @Query('model') model?: string,
    @Query('year') year?: string,
  ): Promise<CatalogResponseDTO> {
    const pageNum = page ? Math.max(1, parseInt(page, 10)) : 1;
    const limitNum = limit
      ? Math.max(1, Math.min(100, parseInt(limit, 10)))
      : 20;

    const filters: { brand?: string; model?: string; year?: number } = {};
    if (brand) filters.brand = brand;
    if (model) filters.model = model;
    if (year) {
      const yearNum = parseInt(year, 10);
      if (!Number.isNaN(yearNum)) {
        filters.year = yearNum;
      }
    }

    return this.partsService.getCatalog(pageNum, limitNum, search, filters);
  }

  @Get(':sku')
  async getPart(@Param('sku') sku: string) {
    if (!sku || sku.trim().length === 0) {
      throw new BadRequestException('SKU is required');
    }
    const part = await this.partsService.getPart(sku.trim());
    if (!part) {
      throw new BadRequestException('Part not found');
    }
    return part;
  }
}
