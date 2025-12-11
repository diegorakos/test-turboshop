# 🚀 Deployment a Vercel - Guía Completa

## Pre-requisitos

- Cuenta en [Vercel](https://vercel.com)
- Git configurado
- Repositorio en GitHub (recomendado)

---

## 📋 Estructura de Deployment

Para Vercel, tenemos dos opciones:

### Opción 1: Frontend en Vercel + Backend en Vercel

- Frontend (Next.js) → Vercel
- Backend (NestJS) → Vercel Serverless Functions

### Opción 2: Frontend en Vercel + Backend en Railway (Recomendado)

- Frontend (Next.js) → Vercel (optimizado para Next.js)
- Backend (NestJS) → Railway (mejor para servicios con estado/caché)

**Recomendación**: Opción 2, porque el backend usa caché in-memory que funciona mejor en Railway.

---

## 🎯 Opción 1: Todo en Vercel

### Paso 1: Preparar el Repositorio

```bash
# Asegúrate de estar en la raíz del proyecto
cd /Users/phi/Desktop/test-turboshop

# Si no has inicializado git:
git init
git add .
git commit -m "Initial commit: Marketplace de Repuestos"

# Conecta con GitHub
git remote add origin https://github.com/tuusuario/test-turboshop.git
git push -u origin main
```

### Paso 2: Deploy del Frontend a Vercel

1. **Ir a [vercel.com/new](https://vercel.com/new)**

2. **Importar proyecto desde Git**

   - Click "Add New" → "Project"
   - Seleccionar repositorio GitHub
   - Autorizar acceso si es necesario

3. **Configurar el Frontend**

   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend/test-turboshop`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

4. **Variables de Entorno**

   Agregar en Vercel Dashboard:

   ```
   NEXT_PUBLIC_API_URL=https://tu-backend.vercel.app/api
   ```

   Por ahora, puedes usar un placeholder y actualizarlo después.

5. **Deploy**
   - Click "Deploy"
   - Esperar 2-3 minutos
   - Anotar la URL del frontend: `https://tu-frontend.vercel.app`

### Paso 3: Deploy del Backend a Vercel (Como API Routes)

**⚠️ Importante**: Vercel usa funciones serverless, por lo que el caché in-memory no persistirá entre requests. Para producción real, considera Railway para el backend.

#### Opción A: Backend como Vercel API Routes

Necesitamos crear un `vercel.json` en el backend:

```bash
cd backend/test-turboshop
```

Crear archivo `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/main.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "src/main.ts",
      "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    }
  ]
}
```

Actualizar `package.json` del backend para incluir:

```json
{
  "engines": {
    "node": "18.x"
  }
}
```

Luego en Vercel:

1. **Crear nuevo proyecto**
   - Click "Add New" → "Project"
   - Seleccionar el mismo repositorio
2. **Configurar el Backend**

   - **Framework Preset**: Other
   - **Root Directory**: `backend/test-turboshop`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Variables de Entorno**

   Agregar en Vercel Dashboard:

   ```
   NODE_ENV=production
   PORT=3000
   PROVIDER_BASE_URL=https://web-production-84144.up.railway.app
   ```

4. **Deploy**

   - Click "Deploy"
   - Anotar la URL: `https://tu-backend.vercel.app`

5. **Actualizar Frontend**
   - Ir al proyecto del frontend en Vercel
   - Settings → Environment Variables
   - Actualizar `NEXT_PUBLIC_API_URL=https://tu-backend.vercel.app/api`
   - Redeploy el frontend

---

## 🎯 Opción 2: Frontend en Vercel + Backend en Railway (Recomendado)

### Paso 1: Deploy Backend a Railway

Sigue las instrucciones en `DEPLOYMENT.md` para Railway.

Resumen rápido:

1. Ir a [railway.app](https://railway.app)
2. Crear nuevo proyecto
3. Deploy from GitHub repo
4. Configurar:
   - **Root Directory**: `backend/test-turboshop`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start:prod`
5. Variables de entorno:
   ```
   NODE_ENV=production
   PORT=3000
   PROVIDER_BASE_URL=https://web-production-84144.up.railway.app
   ```
6. Anotar URL del backend: `https://tu-backend.up.railway.app`

### Paso 2: Deploy Frontend a Vercel

1. **Ir a [vercel.com/new](https://vercel.com/new)**

2. **Importar proyecto**

   - Seleccionar repositorio GitHub

3. **Configurar Frontend**

   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend/test-turboshop`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

4. **Variables de Entorno**

   Agregar en Vercel:

   ```
   NEXT_PUBLIC_API_URL=https://tu-backend.up.railway.app/api
   ```

5. **Deploy**
   - Click "Deploy"
   - Frontend disponible en: `https://tu-frontend.vercel.app`

---

## 🔧 Configuración CORS en Backend

Si el frontend está en Vercel, actualizar `src/main.ts`:

```typescript
app.enableCors({
  origin: [
    "http://localhost:3001",
    "http://localhost:3000",
    "https://tu-frontend.vercel.app",
    "https://*.vercel.app", // Permite todos los previews de Vercel
  ],
  credentials: true,
});
```

---

## 📝 Configuración de Dominio Personalizado (Opcional)

### Frontend

1. Ir a proyecto en Vercel → Settings → Domains
2. Agregar dominio personalizado: `marketplace.tudominio.com`
3. Configurar DNS según instrucciones de Vercel:
   - Tipo: CNAME
   - Nombre: marketplace
   - Valor: cname.vercel-dns.com

### Backend (si está en Railway)

1. Ir a proyecto en Railway → Settings
2. Click "Generate Domain" o agregar dominio personalizado
3. Configurar DNS:
   - Tipo: CNAME
   - Nombre: api
   - Valor: (valor proporcionado por Railway)

---

## 🔄 Deployment Automático

### Vercel

Vercel detecta automáticamente:

- **Push a main**: Deploy a producción
- **Pull Request**: Deploy preview automático
- **Cada commit**: Build y deploy

### Configurar Branches

En Vercel Dashboard:

1. Settings → Git
2. **Production Branch**: `main`
3. **Preview Deployments**: Habilitado

---

## 🧪 Testing del Deployment

### 1. Verificar Backend

```bash
# Health check
curl https://tu-backend.up.railway.app/

# API catalog
curl https://tu-backend.up.railway.app/api/parts/catalog
```

### 2. Verificar Frontend

1. Abrir `https://tu-frontend.vercel.app`
2. Verificar que el catálogo carga
3. Probar búsqueda
4. Probar detalle de producto

### 3. Verificar CORS

Si ves errores de CORS:

- Revisar `src/main.ts` en backend
- Actualizar origin para incluir dominio de Vercel
- Redeploy backend

---

## 🚨 Troubleshooting

### Frontend no puede conectar al Backend

**Problema**: CORS error o network error

**Solución**:

1. Verificar `NEXT_PUBLIC_API_URL` en Vercel:

   - Settings → Environment Variables
   - Debe ser: `https://tu-backend.up.railway.app/api`

2. Verificar CORS en backend (`src/main.ts`):

   ```typescript
   origin: ["https://tu-frontend.vercel.app", "https://*.vercel.app"];
   ```

3. Redeploy ambos servicios

### Build Falla en Vercel

**Problema**: Build command fails

**Solución**:

1. Verificar `package.json` en frontend
2. Asegurar que todas las dependencias estén listadas
3. Verificar que `next.config.ts` sea válido
4. Revisar logs en Vercel Dashboard

### Backend sin respuesta en Vercel

**Problema**: Timeout o 500 errors

**Solución**:

- **No usar Vercel para backend** si necesitas caché persistente
- Usar Railway u otro servicio para backend
- Vercel Serverless tiene límites de tiempo (10s free, 60s Pro)

### Variables de Entorno no se Aplican

**Problema**: Cambios en env vars no se reflejan

**Solución**:

1. Actualizar en Vercel Dashboard
2. **Redeploy** el proyecto (no se aplican automáticamente)
3. Settings → Deployments → Redeploy

---

## 📊 Monitoreo

### Vercel Dashboard

- **Analytics**: Tráfico y performance
- **Logs**: Real-time logs de builds y runtime
- **Deployments**: Historial completo
- **Speed Insights**: Core Web Vitals

### Railway Dashboard (si usas Railway para backend)

- **Metrics**: CPU, Memory, Network
- **Logs**: Real-time logs
- **Deployments**: Historial

---

## 💰 Costos

### Vercel

- **Hobby (Free)**:

  - 100GB bandwidth/mes
  - Unlimited sites
  - Automatic HTTPS
  - Edge Network
  - Preview Deployments

- **Pro ($20/mes)**:
  - 1TB bandwidth
  - 100GB-hrs serverless execution
  - Advanced analytics
  - Password protection

### Railway (si usas para backend)

- **Free Tier**:
  - $5 USD crédito mensual
  - Suficiente para desarrollo
- **Pro**:
  - Pay as you go
  - ~$5-10/mes típicamente

---

## 🎯 URLs Finales

Después del deployment:

```
Frontend (Vercel):  https://marketplace-repuestos.vercel.app
Backend (Railway):  https://marketplace-api.up.railway.app/api

Endpoints:
- Catálogo: https://marketplace-api.up.railway.app/api/parts/catalog
- Detalle:  https://marketplace-api.up.railway.app/api/parts/{sku}
```

---

## 🔄 Actualizar Deployment

### Frontend

```bash
git add .
git commit -m "Update: description"
git push origin main
# Vercel auto-deploys
```

### Backend

```bash
git add .
git commit -m "Update: description"
git push origin main
# Railway auto-deploys
```

---

## 📁 Archivos de Configuración Vercel

### vercel.json (root - opcional)

```json
{
  "version": 2,
  "name": "marketplace-repuestos",
  "builds": [
    {
      "src": "frontend/test-turboshop/package.json",
      "use": "@vercel/next"
    }
  ]
}
```

### .vercelignore (frontend)

```
node_modules
.next
.env*.local
.DS_Store
```

---

## 🎉 Deployment Completo

Una vez deployado:

1. ✅ Frontend en Vercel con HTTPS automático
2. ✅ Backend en Railway (o Vercel) con HTTPS
3. ✅ CORS configurado correctamente
4. ✅ Variables de entorno configuradas
5. ✅ Auto-deploy en cada push
6. ✅ Preview deployments para PRs
7. ✅ Monitoreo y analytics

---

## 🆘 Comandos Útiles

```bash
# Instalar Vercel CLI (opcional)
npm i -g vercel

# Deploy desde CLI
cd frontend/test-turboshop
vercel

# Deploy a producción
vercel --prod

# Ver logs
vercel logs

# Listar deployments
vercel ls
```

---

## 📞 Soporte

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Este proyecto**: Ver README.md y ARCHITECTURE.md

---

**Última actualización**: 2024-12-10  
**Versión**: 1.0.0  
**Status**: ✅ Ready for Vercel Deployment
