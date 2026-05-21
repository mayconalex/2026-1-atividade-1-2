# Atividade 1.2: Servidor Echo Concorrente em TypeScript

Implementação de um Cliente/Servidor TCP concorrente em TypeScript (Deno) rodando via Docker.

## Como executar

Na raiz do projeto, execute os comandos abaixo:

**1. Iniciar o servidor** (em segundo plano):

```bash
docker compose up -d servidor
```

**2. Iniciar os clientes** (abra vários terminais e rode o comando abaixo em cada um para testar a concorrência):

```bash
docker compose run cliente
```

**3. Encerrar a aplicação**:

```bash
docker compose down
```

## Sobre a Concorrência

O servidor atende múltiplos clientes simultaneamente em uma única thread (_Event Loop_). O uso de `async/await` garante que operações de rede (I/O) não bloqueiem a execução. Com isso, não é necessário criar múltiplas threads no Sistema Operacional, o que elimina o custo computacional de realizar trocas de contexto (_context switches_) para cada conexão.
