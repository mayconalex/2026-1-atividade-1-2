FROM denoland/deno:latest

WORKDIR /app

COPY servidor.ts .

# Sinaliza que o container escutará conexões nesta porta
EXPOSE 5000

# Executa o Deno com permissão explícita de rede (--allow-net)
CMD ["run", "--allow-net", "servidor.ts"]