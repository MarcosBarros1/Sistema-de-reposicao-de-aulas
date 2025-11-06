# Imagem base
FROM node:20-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do código-fonte
COPY . .

# Expõe a porta do backend
EXPOSE 3000

# Comando para rodar
CMD ["npm", "start"]