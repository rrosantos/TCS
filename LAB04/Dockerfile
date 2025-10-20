# Dockerfile para Sistema de Gestão de Funcionários
# Usa nginx para servir arquivo HTML estático

FROM nginx:alpine

# Remove configuração padrão do nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia arquivo HTML para o diretório de conteúdo do nginx
COPY sistema-funcionarios.html /usr/share/nginx/html/index.html

# Expõe porta 80
EXPOSE 80

# Comando padrão para iniciar o nginx
CMD ["nginx", "-g", "daemon off;"]