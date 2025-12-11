# Marketplace de Repuestos en Tiempo Real

Un marketplace web que unifica catálogos de repuestos de múltiples proveedores, con actualizaciones en tiempo real de precios y stock.

## Arquitectura

```
┌─────────────────┐
│   Frontend      │
│   (Next.js)     │
└────────┬────────┘
         │ HTTP
         ↓
┌─────────────────────────────┐
│   Backend (NestJS)          │
│  - Agregación de APIs       │
│  - Normalización de datos   │
│  - Caching                  │
└────────┬────────────────────┘
         │
    ┌────┴────┬────────────┬──────────────┐
    ↓         ↓            ↓              ↓
┌────────┐ ┌─────────┐ ┌──────────┐
│AutoParts │RepuestosMax│GlobalParts│
│   Plus   │           │           │
└────────┘ └─────────┘ └──────────┘
```

## Características

- ✅ **Catálogo unificado**: Agregación de 3 proveedores con esquemas distintos
- ✅ **Búsqueda y filtros**: Por texto, marca, modelo y año
- ✅ **Paginación**: Navegación eficiente del catálogo
- ✅ **Vista de detalle**: SKU con precios consolidados y ofertas por proveedor
- ✅ **Caché inteligente**: TTL de 5 minutos para reducir latencia
- ✅ **Manejo de errores**: Tolerancia a fallos de proveedores
- ✅ **Normalización**: Unificación de formatos dispares

## Requisitos Previos

- Node.js 18+
- npm o yarn

## Instalación

### Backend

```bash
cd backend/test-turboshop
npm install
```

### Frontend

```bash
cd frontend/test-turboshop
npm install
```

## Configuración

### Backend (.env)

```env
PORT=3001
PROVIDER_BASE_URL=https://web-production-84144.up.railway.app
NODE_ENV=development
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Ejecución Local

### 1. Iniciar el Backend

```bash
cd backend/test-turboshop
PORT=3001 npm run start:dev
# Backend disponible en http://localhost:3001
```

### 2. Iniciar el Frontend (en otra terminal)

```bash
cd frontend/test-turboshop
npm run dev
# Frontend disponible en http://localhost:3000
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## API Endpoints

### Catálogo

**GET** `/api/parts/catalog`

Query Parameters:

- `page` (número, default: 1): Número de página
- `limit` (número, default: 20, max: 100): Repuestos por página
- `search` (string, opcional): Búsqueda por nombre/descripción/SKU
- `brand` (string, opcional): Filtrar por marca
- `model` (string, opcional): Filtrar por modelo
- `year` (número, opcional): Filtrar por año

Response:

```json
{
  "parts": [
    {
      "sku": "part-001",
      "name": "Pastillas de Freno",
      "description": "Pastillas de freno traseras",
      "price": 45.99,
      "stock": 150,
      "brand": "Bosch",
      "model": "CR-V",
      "year": 2020,
      "providers": [
        {
          "provider": "AutoPartsPlus",
          "price": 45.99,
          "stock": 150,
          "providerSku": "AP-001",
          "lastUpdated": "2024-12-10T10:30:00Z"
        }
      ]
    }
  ],
  "page": 1,
  "limit": 20,
  "total": 150,
  "hasMore": true
}
```

### Detalle por SKU

**GET** `/api/parts/:sku`

Response:

```json
{
  "sku": "part-001",
  "name": "Pastillas de Freno",
  "description": "Pastillas de freno traseras",
  "price": 45.99,
  "stock": 150,
  "brand": "Bosch",
  "model": "CR-V",
  "year": 2020,
  "providers": [
    {
      "provider": "AutoPartsPlus",
      "price": 45.99,
      "stock": 150,
      "providerSku": "AP-001",
      "lastUpdated": "2024-12-10T10:30:00Z"
    },
    {
      "provider": "RepuestosMax",
      "price": 48.5,
      "stock": 75,
      "providerSku": "RM-001",
      "lastUpdated": "2024-12-10T10:35:00Z"
    }
  ]
}
```

## Decisiones de Diseño

### 1. Normalización de Datos

Cada proveedor tiene esquemas distintos. Se implementó un servicio de normalización que:

- Mapea campos automáticamente según convenciones comunes
- Maneja variaciones en nombres de campos (ej: `precio` vs `price`)
- Convierte tipos de datos consistentemente
- Preserva información original en `providerSku`

### 2. Caching con TTL

- Catálogo: caché de 5 minutos
- Partes individuales: caché de 5 minutos
- Reducción de latencia y fallos en cascada
- `PartsService.clearCache()` disponible para invalidación

### 3. Manejo de Errores

- Los errores de un proveedor no impiden servir datos de otros
- Timeouts configurados a 10 segundos por proveedor
- Fallback a datos en caché si hay error reciente
- Frontend maneja errores gracefully

### 4. Consolidación de Ofertas

Cuando un producto existe en múltiples proveedores:

- Se unifica bajo el mismo SKU
- El precio mostrado es el mínimo
- El stock mostrado es el máximo
- Se mantiene lista de todos los proveedores y precios

### 5. Frontend Architecture

- **Client Components**: Catálogo y detail pages usan estado local
- **Debounce**: Búsqueda con delay de 300ms para reducir requests
- **Paginación**: Client-side basada en response total
- **Lazy Loading**: Las imágenes se cargan bajo demanda

## Estructura del Proyecto

```
test-turboshop/
├── backend/
│   └── test-turboshop/
│       ├── src/
│       │   ├── parts/
│       │   │   ├── dtos/
│       │   │   │   └── part.dto.ts          # DTOs normalizados
│       │   │   ├── services/
│       │   │   │   ├── providers.service.ts # Consumo de APIs
│       │   │   │   └── parts.service.ts     # Lógica de negocio
│       │   │   ├── parts.controller.ts      # Endpoints
│       │   │   └── parts.module.ts          # Módulo NestJS
│       │   ├── app.module.ts
│       │   └── main.ts
│       ├── .env
│       └── package.json
├── frontend/
│   └── test-turboshop/
│       ├── app/
│       │   ├── catalog/
│       │   │   └── page.tsx                 # Catálogo
│       │   ├── detail/
│       │   │   └── [sku]/
│       │   │       └── page.tsx             # Detalle por SKU
│       │   └── page.tsx                     # Home
│       ├── lib/
│       │   └── api.ts                       # Cliente API
│       ├── .env.local
│       └── package.json
└── README.md
```

## Scripts de Conveniencia

### Backend

```bash
# Desarrollo
npm run start:dev

# Build
npm run build

# Producción
npm run start:prod

# Linting
npm run lint

# Testing
npm test
npm run test:e2e
```

### Frontend

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Producción
npm run start

# Linting
npm run lint
```

## Deployment a Railway

### Backend

1. Crear nueva aplicación en Railway
2. Conectar el repositorio
3. Configurar build command: `npm run build`
4. Configurar start command: `npm run start:prod`
5. Agregar variables de entorno:
   - `PORT=3000`
   - `PROVIDER_BASE_URL=https://web-production-84144.up.railway.app`
   - `NODE_ENV=production`

### Frontend

1. Crear nueva aplicación en Railway
2. Conectar el repositorio
3. Configurar build command: `npm run build`
4. Configurar start command: `npm run start`
5. Agregar variables de entorno:
   - `NEXT_PUBLIC_API_URL=https://[tu-backend-railway].up.railway.app/api`

## Monitoreo y Debugging

### Logs Backend

```bash
npm run start:dev
# Ver logs en tiempo real
```

### Logs Frontend

```bash
npm run dev
# Ver en browser console (F12)
```

### Cache Debug

Desde el servicio, puedes llamar:

```typescript
this.partsService.clearCache(); // Invalidar caché
```

## Mejoras Futuras

- [ ] WebSockets para actualizaciones en tiempo real automáticas
- [ ] Sincronización periódica en background
- [ ] Historial de precios
- [ ] Comparador de precios
- [ ] Alertas de cambios de precio
- [ ] Reseñas de usuarios
- [ ] Integración de carrito de compras
- [ ] Autenticación y perfiles de usuario

## Testing

### Backend E2E

```bash
cd backend/test-turboshop
npm run test:e2e
```

### Frontend (Manual)

1. Navegar a [http://localhost:3001](http://localhost:3001)
2. Probar búsqueda y filtros
3. Hacer click en un producto para ver detalles
4. Verificar carga de múltiples ofertas

## Troubleshooting

### "Cannot find module '@nestjs/platform-express'"

```bash
cd backend/test-turboshop
npm install
```

### Frontend no puede conectar al backend

Verificar `NEXT_PUBLIC_API_URL` en `.env.local`:

```env
# Para desarrollo local
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Para producción
NEXT_PUBLIC_API_URL=https://[backend-url].up.railway.app/api
```

### Catálogo vacío

1. Verificar que los proveedores están disponibles:

   ```bash
   curl https://web-production-84144.up.railway.app/health
   ```

2. Revisar logs del backend para errores de conexión

3. Verificar caché:
   - Esperar 5 minutos o reiniciar el backend

## Licencia

MIT

## Contacto

Para preguntas o reportar issues, crear un PR o contactar al autor.
