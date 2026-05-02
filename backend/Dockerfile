# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm prune --production

# Production stage
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app /app

EXPOSE 5000

CMD ["npm", "start"]
