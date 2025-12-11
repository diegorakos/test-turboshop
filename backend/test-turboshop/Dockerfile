# Multi-stage build to keep runtime small and reduce attack surface
FROM node:22-alpine3.20 AS base
ENV NODE_ENV=production
WORKDIR /app

FROM base AS deps
# Install exact versions for build (includes dev deps for compilation)
COPY package*.json ./
RUN npm ci

FROM deps AS build
COPY . .
RUN npm run build

FROM base AS prod-deps
COPY package*.json ./
RUN npm ci --omit=dev --prefer-offline --no-audit

# Distroless runtime to minimize CVE surface; node binary provided by base image
FROM gcr.io/distroless/nodejs22-debian12:nonroot AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
EXPOSE 3000
CMD ["/app/dist/main.js"]
