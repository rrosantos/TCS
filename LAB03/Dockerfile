# Use a imagem oficial do Nginx
FROM nginx:alpine

# Remove arquivos de configuração padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia o arquivo HTML para o diretório de documentos do Nginx
COPY cadastro-alunos.html /usr/share/nginx/html/index.html

# Expõe a porta 80
EXPOSE 80

# O Nginx já é iniciado automaticamente na imagem base
CMD ["nginx", "-g", "daemon off;"]