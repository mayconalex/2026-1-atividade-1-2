# Linguagens de programação do trabalho sobre multiplas linhas de execução


## Tabela comparativa

**by google gemini**

A tabela abaixo apresenta a classificação detalhada das 18 linguagens para o seu trabalho, cobrindo o paradigma principal, o objetivo de mercado, o modelo exato de concorrência/thread e o link para a documentação ou site oficial de cada uma:

| Linguagem | Paradigma Principal | Objetivo / Caso de Uso Principal | Modelo de Thread / Concorrência | Link Oficial |
|---|---|---|---|---|
| Ada | Imperativo / Concorrente | Sistemas embarcados de segurança crítica | Tasks nativas (Threads de hardware mapeadas na sintaxe) e Objetos Protegidos | Ada-Lang[](https://ada-lang.io/) |
| C# | Multiparadigma / OO | Sistemas corporativos e jogos (Unity) | Threads gerenciadas (Thread), Pool de Threads e async/await | Microsoft .NET |
| C++ | Multiparadigma / Sistemas | Software de alto desempenho e jogos AAA | Threads de sistema operacional nativas (std::thread, std::jthread) | Cppreference |
| Clojure | Funcional | Processamento de dados na JVM | Software Transactional Memory (STM), Agents e Atoms | Clojure |
| Elixir | Funcional / Atores | Sistemas web distribuídos de alta escala | Processos ultra-leves na BEAM VM (Modelo de Atores com isolamento total) | Elixir |
| Erlang | Funcional / Atores | Telecomunicações e sistemas tolerantes a falhas | Processos ultra-leves na BEAM VM (Passagem de mensagens assíncronas) | Erlang |
| Go (Golang) | Imperativo / Concorrente | Microsserviços e infraestrutura de nuvem | Goroutines (Múltiplas Green Threads mapeadas em threads de S.O. via canais) | Go Dev |
| Haskell | Funcional Puro | Pesquisa acadêmica e sistemas financeiros | Software Transactional Memory (STM) e Green Threads leves gerenciadas pelo GHC | Haskell |
| Java | Orientado a Objetos | Aplicações corporativas e bancárias | Threads de S.O. tradicionais e Virtual Threads (Projeto Loom, Green Threads modernas) | Java Oracle |
| Kotlin | Multiparadigma / OO | Desenvolvimento Android e Backend | Corrotinas (Concorrência estruturada suspensiva sem bloquear threads de S.O.) | Kotlin |
| Lua | Multiparadigma / Script | Linguagem de extensão embutida em jogos/C | Corrotinas cooperativas (Concorrência assimétrica dentro de uma única thread) | Lua[](https://www.fsf.org/) |
| OCaml | Funcional Multiparadigma | Ferramentas estáticas e finanças quantitativas | Multicore OCaml (Threads em paralelo reais e Efeitos Algébricos desde a v5.0) | OCaml |
| PHP | Multiparadigma / Web | Criação de sites e APIs web dinâmicas | Nativamente single-threaded, mas suporta Threads Reais isoladas (Extensão parallel) | PHP |
| Rust | Imperativo / Sistemas | Infraestrutura de rede e segurança de memória | Threads nativas com garantia de ausência de data races em compilação (Fearless Concurrency) | Rust |
| Scala | Híbrido Puro (OO + Funcional) | Processamento de Big Data (Apache Spark) | Modelo de Atores (via ecossistemas como Akka/Pekko) construído sobre a JVM | Scala |
| Smalltalk | Orientado a Objetos Puro | Educacional, prototipagem e interfaces | Green Threads cooperativas gerenciadas inteiramente pela Máquina Virtual | Squeak Smalltalk[](https://squeak.org/) |
| TypeScript | Multiparadigma / Estático | Aplicações web complexas front/backend | Execução Single-threaded baseada em Loop de Eventos; concorrência via Worker Threads | TypeScript |
| Zig | Imperativo / Sistemas | Programação de baixo nível (sucessor do C) | Threads nativas do S.O. gerenciadas manualmente sem runtime oculto | Zig |

**Como expandir a sua análise na pesquisa:**
Se você precisar detalhar a comparação, posso estruturar tópicos focados na segurança de memória (ex: o Ownership do Rust vs a imutabilidade do Clojure) ou no custo computacional de criar uma nova thread (ex: Goroutines vs Threads de S.O. em C++).

## 2. Como usar o Docker com essas linguagens

O Docker funciona no nível do sistema operacional (utilizando containers Linux por padrão). Como todas as linguagens listadas possuem compiladores, interpretadores ou máquinas virtuais que rodam em Linux, qualquer uma delas pode ser empacotada e executada dentro de um container.
Para o seu trabalho, você pode dividir a forma como o Docker lida com essas linguagens em três abordagens estruturais principais:

### 2.1. Linguagens Compiladas para Binários Nativos
(Exemplos: C++, Rust, Go, Zig, Ada)

* Como o Docker lida: O compilador da linguagem roda dentro de um container de desenvolvimento para gerar um binário executável puro do Linux.
* Vantagem no Docker: Permite o uso de Multi-stage builds. Você usa uma imagem pesada com o compilador (ex: gcc, rust:alpine) apenas para gerar o arquivo final e, na etapa seguinte, copia esse binário para uma imagem extremamente leve (como scratch ou alpine), resultando em containers de poucos megabytes.

### 2.2. Linguagens Baseadas em Máquinas Virtuais (VMs)
(Exemplos: Java, Kotlin, Scala, Clojure, Elixir, Erlang, C#)

* Como o Docker lida: O container precisa incluir o ambiente de execução da máquina virtual correspondente (como a JVM para Java/Kotlin/Scala/Clojure, a BEAM para Erlang/Elixir, ou o .NET Runtime para C#).
* Vantagem no Docker: Garante que a versão exata da VM instalada no container seja a mesma em qualquer ambiente, eliminando o clássico erro "funciona na minha máquina". As imagens oficiais (eclipse-temurin para Java, hexpm/elixir para Elixir, ://microsoft.com para C#) já vêm otimizadas para isso.

### 2.3. Linguagens Interpretadas ou com JIT / Runtimes Web
(Exemplos: PHP, Lua, TypeScript, Haskell, OCaml, Smalltalk)

* Como o Docker lida: O container carrega o interpretador ou o motor de execução (como o node para TypeScript, php-fpm para PHP, ou ambientes como pharo para Smalltalk).
* Vantagem no Docker: Facilita a inclusão de extensões de sistema necessárias para concorrência (como compilar o PHP com suporte a ZTS e a extensão parallel diretamente nas instruções do Dockerfile).

## 3. Exemplos de Dockerfile

Para ajudar você a criar o ambiente de testes ou o repositório do seu trabalho, aqui estão os arquivos Dockerfile para todas as 18 linguagens.

------------------------------
### 3.1. Categoria 1: Linguagens Compiladas Nativas (Multi-Stage)
O primeiro estágio compila o código e o segundo estágio apenas executa o binário puro em uma imagem limpa e leve [2].

#### (1) C++
Considera um arquivo chamado main.cpp.

```dockerfile
# Estágio de Compilação
FROM gcc:14 AS builder

WORKDIR /app
COPY main.cpp .
RUN g++ -O3 -pthread main.cpp -o programa

# Estágio de Execução
FROM debian:bookworm-slim
WORKDIR /app
COPY --from=builder /app/programa .
CMD ["./programa"]
```

#### (2) Rust
Considera uma estrutura padrão do comando cargo new app [2].

```dockerfile
# Estágio de Compilação
FROM rust:1.80 AS builder
WORKDIR /app
COPY . .
RUN cargo build --release

# Estágio de Execução
FROM debian:bookworm-slim
WORKDIR /app
# Altere 'app' abaixo para o nome real do seu projeto no Cargo.toml
COPY --from=builder /app/target/release/app .
CMD ["./app"]
```

#### (3) Go (Golang)
Considera um arquivo main.go inicializado com go mod init.

```dockerfile
# Estágio de Compilação
FROM golang:1.23 AS builder
WORKDIR /app
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o programa .

# Estágio de Execução (Usa scratch por não precisar de nenhuma dependência de SO)
FROM scratch
WORKDIR /app
COPY --from=builder /app/programa .
CMD ["./programa"]
```

#### (4) Zig
Considera um arquivo chamado main.zig.

```dockerfile
# Estágio de Compilação
FROM alpine:latest AS builder
RUN apk add --no-cache zig
WORKDIR /app
COPY main.zig .
RUN zig build-exe main.zig -O ReleaseFast

# Estágio de Execução
FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/main .
CMD ["./main"]
```

#### (5) Ada
Considera um arquivo chamado main.adb utilizando o compilador GNAT (GCC).

```dockerfile
# Estágio de Compilação
FROM debian:bookworm-slim AS builder
RUN apt-get update && apt-get install -y gnat gcc-gprbuild && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY main.adb .
RUN gnatmake -O3 main.adb

# Estágio de Execução
FROM debian:bookworm-slim
WORKDIR /app
COPY --from=builder /app/main .
CMD ["./main"]
```

### Categoria 2: Linguagens Baseadas na JVM (Java Virtual Machine)
Todas utilizam imagens oficiais que trazem o JDK (Java Development Kit) para compilar e gerar arquivos .jar ou .class executáveis [2].

#### (6) Java
Considera um arquivo Main.java.

```dockerfile
FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY Main.java .
RUN javac Main.java
CMD ["java", "Main"]
```

#### (7) Kotlin
Considera um arquivo main.kt.

```dockerfile
FROM zenika/kotlin:1.9-jdk17 AS builder
WORKDIR /app
COPY main.kt .
RUN kotlinc main.kt -include-runtime -d programa.jar

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=builder /app/programa.jar .
CMD ["java", "-jar", "programa.jar"]
```

#### (8) Scala
Considera um projeto Scala simples compilado via SBT (Scala Build Tool).

```dockerfile
FROM sbtsoft/sbt:1.9.7-jdk17 AS builder
WORKDIR /app
COPY . .
RUN sbt compile package

FROM eclipse-temurin:17-jre
WORKDIR /app
# Ajuste o caminho do .jar gerado de acordo com a versão do seu projeto Scala
COPY --from=builder /app/target/scala-2.13/*.jar ./programa.jar
CMD ["java", "-jar", "programa.jar"]
```

#### (9) Clojure
Considera um projeto estruturado com Leiningen (project.clj).

```dockerfile
FROM clojure:tools-deps AS builder
WORKDIR /app
COPY . .
RUN clj -ub

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=builder /app .
CMD ["clj", "-M", "-m", "seu.namespace.main"]
```

### Categoria 3: Ecossistema .NET e Microsoft## 10. C#
Considera a estrutura de uma aplicação console padrão do .NET (dotnet new console) [2].

#### (10) C#
Considera a estrutura de uma aplicação console padrão do .NET (dotnet new console) [2].
```dockerfile
# Estágio de Compilação
FROM ://microsoft.com AS builder
WORKDIR /app
COPY . .
RUN dotnet publish -c Release -o out

# Estágio de Execução (Apenas o Runtime, sem o compilador SDK pesado)
FROM ://microsoft.com
WORKDIR /app
COPY --from=builder /app/out .
# Altere 'SeuProjeto.dll' para o nome gerado pelo seu projeto
CMD ["dotnet", "SeuProjeto.dll"]
```

### Categoria 4: Ecossistema BEAM (Atores e Sistemas Distribuídos)## 11. Erlang
Considera um arquivo de código-fonte main.erl.

#### (11) Erlang
Considera um arquivo de código-fonte `main.erl`.

```dockerfile
FROM erlang:27
WORKDIR /app
COPY main.erl .
RUN erlc main.erl
CMD ["erl", "-noshell", "-s", "main", "start", "-s", "init", "stop"]
```

#### (12) Elixir
Considera um arquivo de script `main.exs`.

```dockerfile
FROM elixir:1.17
WORKDIR /app
COPY main.exs .
CMD ["elixir", "main.exs"]
```

### Categoria 5: Linguagens Funcionais Avançadas

#### (13) Haskell
Considera um arquivo chamado main.hs compilado através do GHC.

```dockerfile
FROM haskell:9.6 AS builder
WORKDIR /app
COPY main.hs .
RUN ghc -O2 -threaded main.hs -o programa

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y libgmp10 && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=builder /app/programa .
# Executa habilitando multiprocessamento no runtime do Haskell (+RTS -N)
CMD ["./programa", "+RTS", "-N"]
```

#### (14) OCaml
Considera um arquivo main.ml compilado usando OCaml 5 (com suporte nativo a multicore).

```dockerfile
FROM ocaml/opam:debian-12-ocaml-5.1 AS builder
WORKDIR /app
COPY main.ml .
RUN opam exec -- ocamlopt -o programa main.ml

FROM debian:bookworm-slim
WORKDIR /app
COPY --from=builder /app/programa .
CMD ["./programa"]
```

### Categoria 6: Linguagens de Script, Web e Ambientes Dinâmicos

#### (15) PHP (Com suporte a Threads Reais - ZTS + parallel)
Atenção: Como explicado anteriormente, o PHP padrão não possui threads. Este Dockerfile baixa, compila a versão ZTS (Thread Safe) do PHP e instala a extensão oficial parallel para permitir o paralelismo real por threads via CLI [1]. Considera um script main.php.

```dockerfile
FROM php:8.3-zts-bookworm
# Instala ferramentas necessárias e a extensão parallel
RUN apt-get update && apt-get install -y git unzip \
    && pecl install parallel \
    && docker-php-ext-enable parallel
WORKDIR /app
COPY main.php .
CMD ["php", "main.php"]
```

#### (16) TypeScript
Para executar TypeScript nativamente com foco em concorrência, o interpretador moderno Deno ou Bun é altamente recomendado por já possuir suporte nativo sem passar pela etapa intermediária de compilação do Node.js. Considera um arquivo main.ts.

```dockerfile
FROM denoland/deno:alpine-1.45
WORKDIR /app
COPY main.ts .
# Habilita permissões necessárias se o seu código fizer I/O paralelo
CMD ["run", "--allow-all", "main.ts"]
```

#### (17) Lua
Considera um arquivo de script main.lua.

```dockerfile
FROM alpine:latest
RUN apk add --no-cache lua5.4
WORKDIR /app
COPY main.lua .
CMD ["lua5.4", "main.lua"]
```

#### (18) Smalltalk
Ambientes Smalltalk dependem de imagens virtuais completas. Este exemplo utiliza o Pharo Smalltalk (um dos dialetos modernos mais populares) em modo headless (via linha de comando), executando um arquivo de script script.st.

```dockerfile
FROM alpine:latest AS builder
RUN apk add --no-cache curl bash
WORKDIR /app
# Baixa a máquina virtual do Pharo e a imagem base do sistema
RUN curl https://pharo.org | bash

FROM debian:bookworm-slim
WORKDIR /app
COPY --from=builder /app /app
COPY script.st .
# Executa a imagem Smalltalk processando o script de concorrência fornecido
CMD ["./pharo", "Pharo.image", "st", "script.st"]
```
