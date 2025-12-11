# API Documentation - OpenAPI v3.0.0

## Info

- **Title**: Marketplace de Repuestos API
- **Version**: 1.0.0
- **Base URL**: `http://localhost:3000/api` (desarrollo)
- **Base URL**: `https://<deployment>.up.railway.app/api` (producción)

## Servers

```yaml
servers:
  - url: http://localhost:3000/api
    description: Development server
  - url: https://<backend-url>.up.railway.app/api
    description: Production server
```

## Authentication

No authentication requerida para endpoints públicos.

## Endpoints

### 1. Get Catalog

Obtiene el catálogo de repuestos con búsqueda y filtros.

**Endpoint**

```
GET /parts/catalog
```

**Query Parameters**

| Parameter | Type   | Default | Description                            |
| --------- | ------ | ------- | -------------------------------------- |
| page      | number | 1       | Número de página (>= 1)                |
| limit     | number | 20      | Repuestos por página (1-100)           |
| search    | string | -       | Búsqueda por nombre, descripción o SKU |
| brand     | string | -       | Filtrar por marca exacta               |
| model     | string | -       | Filtrar por modelo exacto              |
| year      | number | -       | Filtrar por año exacto                 |

**Examples**

```bash
# Catálogo completo (página 1, 20 items)
curl "http://localhost:3000/api/parts/catalog"

# Búsqueda
curl "http://localhost:3000/api/parts/catalog?search=freno"

# Filtrar por marca y modelo
curl "http://localhost:3000/api/parts/catalog?brand=Bosch&model=CR-V"

# Paginación
curl "http://localhost:3000/api/parts/catalog?page=2&limit=50"

# Combinado
curl "http://localhost:3000/api/parts/catalog?search=freno&brand=Bosch&page=1&limit=20"
```

**Response**

```json
{
  "parts": [
    {
      "sku": "brake-pad-001",
      "name": "Pastillas de Freno Traseras",
      "description": "Pastillas de freno de cerámica para máximo rendimiento",
      "price": 45.99,
      "stock": 200,
      "brand": "Bosch",
      "model": "CR-V",
      "year": 2020,
      "category": "Frenos",
      "image": "https://example.com/images/brake-pad-001.jpg",
      "providers": [
        {
          "provider": "AutoPartsPlus",
          "price": 45.99,
          "stock": 150,
          "providerSku": "AP-BP-001",
          "lastUpdated": "2024-12-10T10:30:00Z"
        },
        {
          "provider": "RepuestosMax",
          "price": 48.5,
          "stock": 200,
          "providerSku": "RM-BP-001",
          "lastUpdated": "2024-12-10T10:35:00Z"
        },
        {
          "provider": "GlobalParts",
          "price": 47.99,
          "stock": 75,
          "providerSku": "GP-BP-001",
          "lastUpdated": "2024-12-10T10:32:00Z"
        }
      ]
    }
  ],
  "page": 1,
  "limit": 20,
  "total": 1500,
  "hasMore": true
}
```

**Response Codes**

| Code | Description              |
| ---- | ------------------------ |
| 200  | Success                  |
| 400  | Invalid query parameters |
| 500  | Server error             |

---

### 2. Get Part by SKU

Obtiene los detalles completos de un repuesto específico con todas sus ofertas.

**Endpoint**

```
GET /parts/{sku}
```

**Path Parameters**

| Parameter | Type   | Description      |
| --------- | ------ | ---------------- |
| sku       | string | SKU del repuesto |

**Examples**

```bash
# Detalle de un SKU
curl "http://localhost:3000/api/parts/brake-pad-001"

# SKU con caracteres especiales (URL encoded)
curl "http://localhost:3000/api/parts/part%20with%20spaces"
```

**Response**

```json
{
  "sku": "brake-pad-001",
  "name": "Pastillas de Freno Traseras",
  "description": "Pastillas de freno de cerámica para máximo rendimiento",
  "price": 45.99,
  "stock": 200,
  "brand": "Bosch",
  "model": "CR-V",
  "year": 2020,
  "category": "Frenos",
  "image": "https://example.com/images/brake-pad-001.jpg",
  "providers": [
    {
      "provider": "AutoPartsPlus",
      "price": 45.99,
      "stock": 150,
      "providerSku": "AP-BP-001",
      "lastUpdated": "2024-12-10T10:30:00Z"
    },
    {
      "provider": "RepuestosMax",
      "price": 48.5,
      "stock": 200,
      "providerSku": "RM-BP-001",
      "lastUpdated": "2024-12-10T10:35:00Z"
    },
    {
      "provider": "GlobalParts",
      "price": 47.99,
      "stock": 75,
      "providerSku": "GP-BP-001",
      "lastUpdated": "2024-12-10T10:32:00Z"
    }
  ]
}
```

**Response Codes**

| Code | Description    |
| ---- | -------------- |
| 200  | Success        |
| 400  | SKU no válido  |
| 404  | Part not found |
| 500  | Server error   |

---

## Data Types

### PartDTO

```typescript
interface PartDTO {
  sku: string; // Identificador único del repuesto
  name: string; // Nombre del repuesto
  description?: string; // Descripción detallada
  price: number; // Precio mínimo entre proveedores
  stock: number; // Stock máximo entre proveedores
  brand?: string; // Marca (ej: Bosch, Denso)
  model?: string; // Modelo compatible
  year?: number; // Año compatible
  category?: string; // Categoría (ej: Frenos, Motor)
  image?: string; // URL de imagen
  providers: ProviderOfferDTO[]; // Array de ofertas por proveedor
}
```

### ProviderOfferDTO

```typescript
interface ProviderOfferDTO {
  provider: string; // Nombre: AutoPartsPlus|RepuestosMax|GlobalParts
  price: number; // Precio del proveedor
  stock: number; // Stock disponible
  providerSku?: string; // SKU original del proveedor
  lastUpdated: string; // ISO 8601 timestamp
}
```

### CatalogResponseDTO

```typescript
interface CatalogResponseDTO {
  parts: PartDTO[]; // Array de productos
  page: number; // Página actual
  limit: number; // Items por página
  total: number; // Total de items
  hasMore: boolean; // Hay más páginas
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "Invalid query parameters",
  "error": "Bad Request"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Part not found",
  "error": "Not Found"
}
```

### 500 Internal Server Error

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

---

## Rate Limiting

No hay rate limiting actualmente implementado. Para producción, se recomienda:

```typescript
@Throttle({default: {limit: 100, ttl: 60}}) // 100 requests per minute
```

---

## Caching Strategy

- **Catálogo**: Cacheado por 5 minutos
- **Parts individuales**: Cacheados por 5 minutos
- **Header**: `Cache-Control: private, max-age=300`

---

## CORS

Habilitado para:

- http://localhost:3001
- http://localhost:3000
- https://yourdomain.com (producción)

---

## HTTP Headers

### Request

```
GET /api/parts/catalog HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Accept: application/json
```

### Response

```
HTTP/1.1 200 OK
Content-Type: application/json
Access-Control-Allow-Origin: http://localhost:3001
Cache-Control: private, max-age=300
```

---

## Performance Notes

- **Latency**: ~2-3s en primer request, <100ms en cached
- **Timeout**: 10 segundos por proveedor
- **Parallel Requests**: Múltiples proveedores en paralelo
- **Partial Success**: 1-2 proveedores disponibles es suficiente

---

## Providers Integration

### AutoPartsPlus

Base: https://web-production-84144.up.railway.app

- `GET /api/autopartsplus/parts?sku=SKU`
- `GET /api/autopartsplus/catalog?page=1&limit=20`

### RepuestosMax

Base: https://web-production-84144.up.railway.app

- `GET /api/repuestosmax/productos?codigo=CODE`
- `GET /api/repuestosmax/catalogo?pagina=1&limite=20`

### GlobalParts

Base: https://web-production-84144.up.railway.app

- `GET /api/globalparts/inventory/search?partNumber=PART`
- `GET /api/globalparts/inventory/catalog?page=1&itemsPerPage=20`

---

## SDK/Client Examples

### cURL

```bash
curl -X GET "http://localhost:3000/api/parts/catalog?page=1&limit=20" \
  -H "Accept: application/json"
```

### JavaScript/Axios

```typescript
import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Get catalog
const catalog = await client.get("/parts/catalog", {
  params: {
    page: 1,
    limit: 20,
    search: "freno",
    brand: "Bosch",
  },
});

// Get part details
const part = await client.get("/parts/brake-pad-001");
```

### Python/Requests

```python
import requests

API_URL = 'http://localhost:3000/api'

# Get catalog
response = requests.get(
    f'{API_URL}/parts/catalog',
    params={
        'page': 1,
        'limit': 20,
        'search': 'freno'
    }
)
data = response.json()

# Get part details
response = requests.get(f'{API_URL}/parts/brake-pad-001')
part = response.json()
```

### TypeScript

```typescript
import { partsAPI, Part, CatalogResponse } from "@/lib/api";

// Get catalog
const catalog: CatalogResponse = await partsAPI.getCatalog(1, 20, "freno");

// Get part
const part: Part = await partsAPI.getPart("brake-pad-001");

// With filters
const filtered = await partsAPI.getCatalog(1, 20, undefined, {
  brand: "Bosch",
  model: "CR-V",
  year: 2020,
});
```

---

## Changelog

### Version 1.0.0 (2024-12-10)

- ✅ Initial release
- ✅ Catalog endpoint with search and filters
- ✅ Detail endpoint by SKU
- ✅ Aggregation of 3 providers
- ✅ Caching strategy
- ✅ Error handling

---

## Contact & Support

Para preguntas o reportes de bugs:

1. Revisa README.md y ARCHITECTURE.md
2. Revisa logs del servidor
3. Abre un issue en GitHub

---

Last Updated: 2024-12-10
API Version: 1.0.0
