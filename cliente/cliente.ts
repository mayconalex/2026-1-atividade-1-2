// Define o host via variável de ambiente (Docker) ou assume localhost (desenvolvimento)
const host = Deno.env.get("SERVER_HOST") || "127.0.0.1";

console.log(`Conectando ao servidor em ${host}:5000...`);
const conexao = await Deno.connect({ hostname: host, port: 5000 });
console.log("Conexão estabelecida. Digite 'sair' para encerrar.\n");

const buffer = new Uint8Array(1024);

try {
    while (true) {
        const mensagem = prompt("Mensagem:");

        if (!mensagem || mensagem.toLowerCase() === "sair") {
            break;
        }

        const dados = new TextEncoder().encode(mensagem);
        await conexao.write(dados);

        // I/O assíncrono: suspende a execução local até a chegada do pacote de resposta
        const bytesLidos = await conexao.read(buffer);

        if (!bytesLidos) {
            console.log("Conexão encerrada pelo servidor.");
            break;
        }

        const resposta = new TextDecoder().decode(
            buffer.subarray(0, bytesLidos)
        );
        console.log(`Servidor: ${resposta}\n`);
    }
} catch (erro) {
    console.error("Erro na comunicação:", erro);
} finally {
    conexao.close();
    console.log("Cliente finalizado.");
}
