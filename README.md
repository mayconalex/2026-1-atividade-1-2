# Atividade 1.2: Servidor Echo em TypeScript (Sequencial vs. Concorrente)

Comparativo de um modelo Cliente/Servidor TCP em TypeScript (Deno) rodando via Docker. O projeto demonstra a diferença prática entre o bloqueio de fluxo (sequencial) e o uso do Event Loop para I/O assíncrono (concorrente).

## Como executar os testes

O ambiente subirá 1 servidor e 10 réplicas de clientes autônomos simultaneamente. Na raiz do projeto, execute os passos abaixo:

### 1. Teste do Modelo Sequencial (Sem "Thread")

Neste modelo, o servidor processa um cliente por vez. Os demais aguardam em uma fila do Sistema Operacional.

-   **Subir o container:**
    ```bash
    docker compose -f docker-compose-sequencial.yml up --build -d
    ```
-   **Acompanhar os logs:**
    ```bash
    docker compose -f docker-compose-sequencial.yml logs -f servidor
    ```
    _(Observe que o servidor atende um cliente a cada 2 segundos)._
-   **Encerrar o container:**
    ```bash
    docker compose -f docker-compose-sequencial.yml down
    ```

### 2. Teste do Modelo Concorrente (Com "Thread")

Neste modelo, o servidor aceita e processa todos os clientes instantaneamente através do Event Loop.

-   **Subir o container:**
    ```bash
    docker compose -f docker-compose-concorrente.yml up --build -d
    ```
-   **Acompanhar os logs:**
    ```bash
    docker compose -f docker-compose-concorrente.yml logs -f servidor
    ```
    _(Observe que o servidor aceita todos os 10 clientes simultaneamente)._
-   **Encerrar o container:**
    ```bash
    docker compose -f docker-compose-concorrente.yml down
    ```

## Sobre a Concorrência e Implementação

A transição do modelo sequencial para o concorrente em TypeScript exige a remoção de apenas uma diretiva (`await`) na chamada da rotina de conexão.

Ao delegar o atendimento ao **Event Loop** sem bloquear o fluxo principal, o uso de `async/await` garante que operações de rede (_I/O-bound_) sejam processadas em segundo plano. Com isso, não é necessário criar múltiplas threads no Sistema Operacional (evitando o modelo multithread 1:1), o que elimina o alto custo computacional de realizar trocas de contexto (_context switches_) no escalonador para cada nova conexão.
