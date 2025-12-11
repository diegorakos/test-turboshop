# Provider API Integration - Quick Reference

## Status: ✅ COMPLETE

All three provider API normalization methods have been updated to handle the actual response formats discovered through live API testing.

## Provider Configuration

### Base URL
```
https://web-production-84144.up.railway.app
```

### AutoPartsPlus
- **Catalog Endpoint**: `/api/autopartsplus/catalog?page=1&limit=20`
- **Detail Endpoint**: `/api/autopartsplus/parts?sku={sku}`
- **Response Format**: Flat structure with nested arrays
- **Total Items**: 98 (20 pages of 5 items)
- **Key Fields**: `title`, `sku`, `unit_price`, `qty_available`, `brand_name`, `img_urls`

### RepuestosMax
- **Catalog Endpoint**: `/api/repuestosmax/catalogo?pagina=1&limite=20`
- **Detail Endpoint**: `/api/repuestosmax/productos?codigo={codigo}`
- **Response Format**: Deeply hierarchical nested objects
- **Total Items**: 47 (10 pages of 5 items)
- **Key Structure**: 
  - `identificacion` → SKU, OEM code
  - `informacionBasica` → Name, brand, category
  - `precio` → Price information
  - `inventario` → Stock and warehouse info
  - `multimedia` → Images
  - `compatibilidad` → Vehicle compatibility

### GlobalParts
- **Catalog Endpoint**: `/api/globalparts/inventory/catalog?page=1&itemsPerPage=20`
- **Detail Endpoint**: `/api/globalparts/inventory/search?partNumber={partNumber}`
- **Response Format**: Enterprise envelope (ResponseEnvelope → Body → CatalogListing)
- **Total Items**: 175 (35 pages of 5 items)
- **Wrapper Structure**: Header contains metadata, Body contains data
- **Key Paths**: 
  - `ResponseEnvelope.Body.CatalogListing.Items[].ItemHeader`
  - `ResponseEnvelope.Body.CatalogListing.Items[].ProductDetails`
  - `ResponseEnvelope.Body.CatalogListing.Items[].PricingInfo`
  - `ResponseEnvelope.Body.CatalogListing.Items[].AvailabilityInfo`

## Unified Data Model

All providers normalize to the `PartDTO` interface:

```typescript
interface PartDTO {
  sku: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  brand?: string;
  model?: string;
  year?: number;
  image?: string;
  category?: string;
  providers: ProviderOfferDTO[];
}

interface ProviderOfferDTO {
  provider: 'AutoPartsPlus' | 'RepuestosMax' | 'GlobalParts';
  price: number;
  stock: number;
  providerSku: string;
  lastUpdated: Date;
}
```

## Aggregation Logic

The `PartsService` consolidates multiple provider offers:

1. **Search**: Searches across all three providers simultaneously
2. **Deduplication**: Groups identical SKUs from different providers
3. **Price Consolidation**: Minimum price across all providers
4. **Stock Consolidation**: Maximum stock across all providers
5. **Caching**: 5-minute TTL for catalog queries

## API Endpoints

### Backend (`/api/parts`)
- `GET /api/parts/catalog?page=1&limit=20` - Aggregate catalog with search/filters
- `GET /api/parts/:sku` - Get part details with all provider offers

### Frontend Routes
- `/` - Home page
- `/catalog` - Product catalog with search and filters
- `/detail/:sku` - Product detail view with provider comparison

## Recent Changes

✅ **Provider Normalization Methods Updated**
- All three `normalizeX()` methods now correctly extract fields from actual API responses
- Proper handling of nested objects with optional chaining
- Type-safe field conversion with String/parseInt
- Comprehensive fallback chains for robustness

✅ **Build Verification**
- Backend compiles successfully: `npm run build` ✓
- No TypeScript errors
- All imports resolved

✅ **Deployment**
- Changes committed and pushed to GitHub
- Railway backend automatically redeploying
- Expected deployment time: 2-5 minutes

## Testing Endpoints

Once Railway deployment completes:

```bash
# Test aggregated catalog (should show items from all 3 providers)
curl "http://your-railway-url/api/parts/catalog?page=1&limit=5"

# Test individual SKU detail
curl "http://your-railway-url/api/parts/PART-SKU-123"

# Test with search
curl "http://your-railway-url/api/parts/catalog?page=1&limit=5&search=brake"

# Test with filters
curl "http://your-railway-url/api/parts/catalog?page=1&limit=5&brand=Bosch"
```

## Debugging

### If catalog returns empty
1. Check provider APIs are accessible: `curl https://web-production-84144.up.railway.app/api/autopartsplus/catalog?page=1&limit=1`
2. Verify normalization in backend logs
3. Check network connectivity in CloudFlare/Railway console

### If individual provider fails
- Check provider-specific endpoint logs
- Verify parameter formatting (page vs pagina, limit vs limite)
- Check for timeout issues (10-second limit per request)

### Provider-Specific Issues

**AutoPartsPlus**
- Expects `page` and `limit` parameters (not `pagina`/`limite`)
- Returns array in `parts` property
- Price format: integer representing CLP cents (divide by 100 for display)

**RepuestosMax**
- Expects `pagina` and `limite` parameters (Spanish naming)
- Returns array in `productos` property
- Deeply nested structure requires null-safe navigation

**GlobalParts**
- Expects `page` and `itemsPerPage` parameters
- Returns items in envelope structure: `ResponseEnvelope.Body.CatalogListing.Items`
- Includes header metadata with transaction IDs and timing info

## File Changes Summary

- **Modified**: `backend/test-turboshop/src/parts/services/providers.service.ts`
  - Updated 3 normalization methods (100+ lines changed)
  - Updated 6 catalog/detail fetch methods (20+ lines changed)
  - Maintained backward compatibility with error handling

- **Created**: `NORMALIZATION_UPDATE.md`
  - Detailed documentation of changes
  - Before/after field mapping comparison

## Next Priority

1. ✅ Provider normalization updated
2. ⏳ Railway deployment completion (2-5 min from push)
3. ⏳ Manual testing of aggregated endpoints
4. ⏳ Frontend testing against live backend
5. ⏳ Performance monitoring and cache verification

