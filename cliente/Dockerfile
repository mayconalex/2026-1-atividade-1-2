FROM denoland/deno:alpine-1.45

WORKDIR /app

COPY cliente.ts .

# Executa o Deno com permissões de rede (--allow-net) e de variáveis de ambiente (--allow-env)
CMD ["run", "--allow-net", "--allow-env", "cliente.ts"]