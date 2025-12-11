# ⚡ Quick Start - Marketplace de Repuestos

## 🚀 Iniciar en 2 minutos

### Opción 1: Con npm (Recomendado)

**Terminal 1 - Backend**

```bash
cd backend/test-turboshop
npm install
npm run start:dev
```

**Terminal 2 - Frontend**

```bash
cd frontend/test-turboshop
npm install
npm run dev
```

✅ Abre http://localhost:3001 en tu navegador

### Opción 2: Con Docker

```bash
docker-compose up
```

✅ Abre http://localhost:3001 en tu navegador

## 📋 Requisitos Previos

- Node.js 18+
- npm o yarn
- (Opcional) Docker & Docker Compose

## 🏗️ Estructura del Proyecto

```
test-turboshop/
├── backend/test-turboshop/     # API NestJS
├── frontend/test-turboshop/    # App Next.js
├── README.md                   # Documentación completa
├── ARCHITECTURE.md             # Diseño técnico
├── DEPLOYMENT.md              # Guía de deployment
├── QUICK_START.md             # Este archivo
└── docker-compose.yml         # Compose para dev local
```

## 🔗 URLs Locales

- Frontend: http://localhost:3001
- Backend API: http://localhost:3000/api
- Catálogo API: http://localhost:3000/api/parts/catalog
- Detalle API: http://localhost:3000/api/parts/{sku}

## 🧪 Testing

### Verificar Backend

```bash
curl http://localhost:3000/
# Debería retornar el mensaje de bienvenida
```

### Verificar Frontend

Abrir http://localhost:3001 y:

1. ✅ Ver página de inicio
2. ✅ Click en "Explorar Catálogo"
3. ✅ Ver lista de productos
4. ✅ Click en un producto
5. ✅ Ver detalles y ofertas

## 🔄 Recarga en Vivo

### Backend

- Cambios en archivos se detectan automáticamente
- Hot reload habilitado con `npm run start:dev`

### Frontend

- Cambios en archivos se detectan automáticamente
- Browser recarga automáticamente

## 📊 Monitoreo

### Backend Logs

```bash
# El servidor mostrará logs como:
[Nest] 12345   - 2024/12/10 10:30:45   LOG [NestFactory] Nest app successfully started
[Nest] 12345   - 2024/12/10 10:30:45   LOG API running on http://localhost:3000
```

### Frontend Logs

Abre DevTools (F12) → Console para ver logs de JavaScript

## 🛠️ Troubleshooting

### "Port 3000 is already in use"

```bash
# Kill proceso en puerto 3000
lsof -i :3000
kill -9 <PID>

# O cambia el puerto:
PORT=3001 npm run start:dev
```

### "Cannot find module"

```bash
# Reinstala dependencias
npm install

# O limpia caché
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### "API connection error"

1. Verifica que el backend está corriendo: http://localhost:3000
2. Revisa CORS en `src/main.ts`
3. Revisa la URL en `.env.local`

## 📚 Documentación Completa

- **[README.md](./README.md)** - Descripción general, arquitectura, APIs
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Diseño técnico detallado
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Desplegar a Railway
- **[QUICK_START.md](./QUICK_START.md)** - Este archivo

## 🎯 Próximos Pasos

1. **Explorar el código**

   - Backend: `backend/test-turboshop/src/`
   - Frontend: `frontend/test-turboshop/app/`

2. **Hacer cambios**

   - Cambios se recargan automáticamente

3. **Deploy**
   - Seguir instrucciones en [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🆘 Soporte

- Revisar logs en terminal
- Abrir DevTools (F12) en navegador
- Revisar documentación en README.md y ARCHITECTURE.md

---

¡Listo! 🎉 Ahora tienes el Marketplace de Repuestos ejecutándose localmente.
