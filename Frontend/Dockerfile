# Imagem base
FROM node:20-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia PRIMEIRO os package.json para aproveitar o cache do Docker
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do código-fonte
COPY . .

# Expõe a porta
EXPOSE 5173

# Comando para rodar a aplicação em modo de desenvolvimento
# O '--host 0.0.0.0' serve para expor o app para fora do contêiner (necessário para o Vite/React/etc)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]