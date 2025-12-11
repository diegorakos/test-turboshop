FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production && npm run build

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
