# Imagem base
FROM node:22.16.0

# Define o diretório principal
WORKDIR /app

# Copia apenas os manifests de dependências da raiz (para cache eficiente)
COPY package*.json ./
RUN npm install

# Copia backend e frontend
COPY Backend ./Backend
COPY Frontend ./Frontend

# Instala dependências do backend
WORKDIR /app/Backend
RUN npm install

# Instala dependências do frontend
WORKDIR /app/Frontend
RUN npm install

# Volta para o diretório raiz
WORKDIR /app

# Expõe as portas do backend (3000) e frontend (5173)
EXPOSE 3000 5173

# Define o comando padrão
CMD ["npm", "start"]
