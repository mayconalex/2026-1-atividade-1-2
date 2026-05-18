# Tutorial: Docker Compose com cliente echo e servidor echo em Python

Este tutorial mostra como subir dois serviços com Docker Compose:

- `echo-server`: servidor TCP em Python que devolve a mesma mensagem recebida.
- `echo-client`: cliente TCP em Python que envia uma mensagem e imprime o retorno.

## 1) Estrutura de arquivos

```text
docker-compose-echo-python/
├── client/
│   ├── client.py
│   └── Dockerfile
├── server/
│   ├── server.py
│   └── Dockerfile
└── docker-compose.yml
```

## 2) Como funciona

- O Docker Compose cria uma rede interna para os serviços.
- O cliente acessa o servidor pelo nome do serviço (`echo-server`), sem precisar de IP.
- O servidor abre a porta `5000` e responde com o mesmo conteúdo recebido.

## 3) Subindo o ambiente

No diretório raiz do repositório:

```bash
cd docker-compose-echo-python
docker compose up --build
```

Você verá logs semelhantes a:

```text
echo-client  | [echo-client] Conectado em echo-server:5000
echo-client  | [echo-client] Enviado:  Mensagem via Docker Compose
echo-client  | [echo-client] Recebido: Mensagem via Docker Compose
```

## 4) Testando com outra mensagem

Altere a variável `ECHO_MESSAGE` no `docker-compose.yml`:

```yaml
environment:
  ECHO_MESSAGE: "Nova mensagem de teste"
```

Depois rode novamente:

```bash
docker compose up --build
```

## 5) Encerrando

Para parar os containers:

```bash
docker compose down
```

Se quiser remover também as imagens criadas localmente:

```bash
docker compose down --rmi local
```
