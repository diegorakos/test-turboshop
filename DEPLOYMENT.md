# Guía de Deployment a Railway

## Pre-requisitos

- Cuenta en [Railway.app](https://railway.app)
- Git configurado
- Repositorio en GitHub

## Paso 1: Preparar el Repositorio

```bash
git init
git add .
git commit -m "Initial commit: Full-stack marketplace"
git push origin main
```

## Paso 2: Crear Proyecto en Railway

1. Ir a [railway.app/dashboard](https://railway.app/dashboard)
2. Click en "New Project"
3. Seleccionar "Deploy from GitHub repo"
4. Autorizar GitHub y seleccionar el repositorio

## Paso 3: Configurar Backend

### Crear Servicio Backend

1. En el proyecto, click "New Service"
2. Seleccionar "GitHub Repo"
3. Configurar:
   - **Root Directory**: `backend/test-turboshop`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start:prod`

### Variables de Entorno del Backend

En Railway Dashboard → Backend Service → Variables:

```
NODE_ENV=production
PORT=3000
PROVIDER_BASE_URL=https://web-production-84144.up.railway.app
```

## Paso 4: Configurar Frontend

### Crear Servicio Frontend

1. Click "New Service"
2. Seleccionar "GitHub Repo"
3. Configurar:
   - **Root Directory**: `frontend/test-turboshop`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start`

### Variables de Entorno del Frontend

En Railway Dashboard → Frontend Service → Variables:

```
NEXT_PUBLIC_API_URL=https://<BACKEND_URL>/api
```

Para obtener la URL del backend:

1. En Backend Service → Settings
2. Copiar el dominio público asignado
3. Agregar `/api` al final

Ejemplo:

```
NEXT_PUBLIC_API_URL=https://turboshop-backend-production.up.railway.app/api
```

## Paso 5: Configurar Dominio Personalizado (Opcional)

### Para el Backend

1. Backend Service → Settings
2. "Generate Domain" o agregar dominio personalizado
3. Anotar la URL pública

### Para el Frontend

1. Frontend Service → Settings
2. Click en el dominio generado para hacerlo público
3. Configurar dominio personalizado si es necesario

## Paso 6: Verificación

1. Acceder al frontend en `https://<FRONTEND_URL>`
2. Navegar al catálogo
3. Verificar que se cargan los productos
4. Hacer click en un producto para ver detalles
5. Verificar que se muestran múltiples ofertas

## Troubleshooting

### El backend no inicia

```bash
# Ver logs en Railway
# Backend Service → Logs

# Verificar variables de entorno
# Backend Service → Variables

# Reinstalar dependencias
# Forzar rebuild en Railway
```

### El frontend no puede conectar al backend

1. Verificar `NEXT_PUBLIC_API_URL`:

   ```bash
   # Debe incluir el dominio completo y /api
   https://your-backend.up.railway.app/api
   ```

2. Verificar CORS en backend (`src/main.ts`):

   - Debe incluir origen del frontend

3. Revisar logs del frontend (browser console)

### Catálogo vacío

1. Verificar que los proveedores están disponibles:

   ```bash
   curl https://web-production-84144.up.railway.app/health
   ```

2. Revisar logs del backend en Railway

### Escalado

Si hay alta demanda, en Railway Dashboard:

1. Backend Service → Settings
2. Aumentar "Memory" a 1GB si es necesario
3. Aumentar "Replica Instances" si es necesario

## Monitoreo

Railway proporciona:

- **Logs**: Real-time en Dashboard
- **Metrics**: CPU, Memory, Network en pestaña Metrics
- **Deployments**: Historial en pestaña Deployments

## Rollback

Si hay problemas:

1. Deployments tab
2. Click en un deployment anterior
3. Click "Redeploy"

## Costos

Railway proporciona:

- $5 USD de crédito mensual gratuito
- Pricing por uso después de eso
- Suficiente para las cargas típicas de este proyecto

## URLs Finales

Después del deployment, obtendrás:

- **Frontend**: `https://<frontend-domain>.up.railway.app`
- **Backend API**: `https://<backend-domain>.up.railway.app/api`

## Scripts de Ayuda

Para simplificar deployments futuros, crear `scripts/deploy.sh`:

```bash
#!/bin/bash

# Actualizar y desplegar
git add .
git commit -m "Deploy: $(date)"
git push origin main

# Railway automáticamente detectará cambios y desplegará
```
