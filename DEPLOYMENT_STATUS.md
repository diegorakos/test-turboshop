# ✅ Configuración Completa - Vercel + Railway

## 🎯 URLs de tu Deployment

Anota tus URLs aquí:

```
Frontend (Vercel):  https://[tu-proyecto].vercel.app
Backend (Railway):  https://[tu-backend].up.railway.app
```

---

## 📋 Checklist de Configuración

### ✅ Backend (Railway)

1. **Variables de entorno configuradas:**

   ```
   NODE_ENV=production
   PORT=3000
   PROVIDER_BASE_URL=https://web-production-84144.up.railway.app
   ```

2. **CORS actualizado:**

   - ✅ Ya incluye soporte para `*.vercel.app`
   - ✅ Ya incluye soporte para `*.railway.app`

3. **Siguiente paso:**

   ```bash
   # Hacer commit y push para aplicar cambios de CORS
   git add .
   git commit -m "chore: update CORS for Vercel"
   git push origin main
   ```

   Railway detectará el push y redesplegará automáticamente.

---

### ✅ Frontend (Vercel)

1. **En Vercel Dashboard:**

   - Ve a tu proyecto → Settings → Environment Variables

2. **Agrega esta variable:**

   ```
   Variable: NEXT_PUBLIC_API_URL
   Value: https://[TU-BACKEND-RAILWAY].up.railway.app/api
   ```

   **⚠️ Importante:** Reemplaza `[TU-BACKEND-RAILWAY]` con tu URL real de Railway

3. **Redeploy:**

   - Ve a Deployments tab
   - Click en el deployment más reciente
   - Click "Redeploy"

   O simplemente haz un commit:

   ```bash
   git commit --allow-empty -m "trigger redeploy"
   git push origin main
   ```

---

## 🧪 Verificación

### 1. Verificar Backend (Railway)

```bash
# Verificar que el backend responde
curl https://[TU-BACKEND].up.railway.app/

# Verificar API de catálogo
curl https://[TU-BACKEND].up.railway.app/api/parts/catalog
```

Deberías ver respuesta JSON con productos.

### 2. Verificar Frontend (Vercel)

1. Abre `https://[TU-FRONTEND].vercel.app`
2. ✅ Página de inicio carga
3. ✅ Click en "Explorar Catálogo"
4. ✅ Se muestra el grid de productos
5. ✅ Búsqueda funciona
6. ✅ Filtros funcionan
7. ✅ Click en un producto muestra detalle

### 3. Verificar Consola del Navegador

1. Abre DevTools (F12)
2. Ve a Console
3. No debe haber errores de CORS
4. Debe haber requests exitosos a tu backend de Railway

---

## 🔧 Si algo no funciona

### Error: CORS Policy

**Síntoma:**

```
Access to fetch at 'https://...' has been blocked by CORS policy
```

**Solución:**

1. Verificar que el CORS está actualizado en `backend/test-turboshop/src/main.ts`
2. Hacer commit y push
3. Esperar a que Railway redespliegue
4. Refrescar el frontend

### Error: Network Error / Failed to Fetch

**Síntoma:** Frontend no puede conectar al backend

**Solución:**

1. Verificar `NEXT_PUBLIC_API_URL` en Vercel:

   - Settings → Environment Variables
   - Debe terminar en `/api`
   - Ejemplo: `https://test-turboshop-production.up.railway.app/api`

2. Verificar que el backend está corriendo:

   ```bash
   curl https://[TU-BACKEND].up.railway.app/api/parts/catalog
   ```

3. Redeploy el frontend en Vercel

### Frontend muestra catálogo vacío

**Síntoma:** La página carga pero no hay productos

**Solución:**

1. Abrir DevTools (F12) → Network
2. Buscar request a `/api/parts/catalog`
3. Ver la respuesta:
   - Si hay error 500: Revisar logs del backend en Railway
   - Si hay error 404: Verificar `NEXT_PUBLIC_API_URL`
   - Si hay timeout: Los proveedores externos pueden estar lentos

---

## 📊 Monitoreo

### Railway (Backend)

1. Ve a tu proyecto en Railway
2. Click en el servicio
3. Tabs disponibles:
   - **Metrics**: CPU, Memory, Network
   - **Deployments**: Historial
   - **Logs**: Real-time logs

### Vercel (Frontend)

1. Ve a tu proyecto en Vercel
2. Tabs disponibles:
   - **Analytics**: Tráfico
   - **Speed Insights**: Performance
   - **Logs**: Runtime logs
   - **Deployments**: Historial

---

## 🔄 Deployments Futuros

### Automático

Ambos servicios se actualizan automáticamente en cada push:

```bash
# Hacer cambios
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main

# Railway y Vercel detectan el push y redesplegan automáticamente
```

### Manual

**Railway:**

- Dashboard → Deployments → Click "Redeploy"

**Vercel:**

- Dashboard → Deployments → Click deployment → "Redeploy"

---

## 🎉 Todo Listo!

Tu Marketplace de Repuestos está ahora en producción:

- ✅ Frontend en Vercel con SSL automático
- ✅ Backend en Railway con SSL automático
- ✅ CORS configurado correctamente
- ✅ Variables de entorno configuradas
- ✅ Auto-deployment en cada push
- ✅ Logs y monitoreo disponibles

---

## 📝 Siguiente Commit

Para aplicar los cambios de CORS, ejecuta:

```bash
cd /Users/phi/Desktop/test-turboshop
git add .
git commit -m "chore: configure CORS for Vercel deployment"
git push origin main
```

Esto redesplegará el backend en Railway con el CORS actualizado.

---

**Fecha de configuración**: 2024-12-10  
**Status**: ✅ LISTO PARA USAR
