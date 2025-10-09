FROM node:22.16.0

# Definindo o diretório de trabalho
WORKDIR /app

# Copiando arquivos de dependências da raiz
COPY package*.json ./

# Copiando tudo (backend e frontend)
COPY Backend ./Backend
COPY Frontend ./Frontend

# Instalando dependências
RUN npm install && cd Backend && npm install && cd ../Frontend && npm install

# Expondo a porta do backend
EXPOSE 3000 5173

CMD [ "npm", "start"]