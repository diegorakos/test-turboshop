FROM node:22-bookworm-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Remove dev dependencies (optional)
RUN npm prune --production

EXPOSE 3000

CMD ["npm", "run", "start"]
