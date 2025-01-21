# Etapa 1: Build
FROM node:18-alpine AS builder

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos necessários
COPY package.json package-lock.json ./

# Instala as dependências
RUN npm ci

# Copia o restante do código para o container
COPY . .

RUN npx prisma db push

# Gera o Prisma Client
RUN npx prisma generate

# Compila o projeto
RUN npm run build

# Etapa 2: Runtime
FROM node:18-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos necessários da etapa de build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package.json ./

# Exponha a porta (ajuste conforme necessário)
EXPOSE 3000

# Inicia o servidor
CMD ["node", "dist/main"]
