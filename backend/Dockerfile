# Build stage
FROM node:18-bullseye-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm prune --production

# Production stage
FROM node:18-bullseye-slim

WORKDIR /app

COPY --from=builder /app /app

EXPOSE 5000

CMD ["npm", "start"]
