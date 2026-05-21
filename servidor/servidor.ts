const listener = Deno.listen({ port: 5000 });
console.log("Servidor escutando na porta 5000...");

// Trata a conexão TCP de um cliente individual
async function tratarConexao(conexao: Deno.Conn) {
    console.log("[Nova Conexão] Cliente aceito.");
    const buffer = new Uint8Array(1024);

    try {
        while (true) {
            // I/O assíncrono: lê os dados sem bloquear o Event Loop
            const bytesLidos = await conexao.read(buffer);

            if (!bytesLidos) {
                console.log("[Desconexão] Cliente encerrou a conexão.");
                break;
            }

            const mensagem = new TextDecoder().decode(
                buffer.subarray(0, bytesLidos)
            );
            console.log(`[Recebido]: ${mensagem.trim()}`);

            // Retorna o eco da mensagem ao cliente
            const resposta = new TextEncoder().encode(`Echo TS: ${mensagem}`);
            await conexao.write(resposta);
        }
    } catch (erro) {
        console.error("Erro de conexão:", erro);
    } finally {
        // Libera os recursos de rede do S.O. associados a esta conexão
        conexao.close();
    }
}

// Loop principal de aceitação de clientes
for await (const conexao of listener) {
    // A omissão do 'await' nesta chamada delega a execução ao Event Loop,
    // garantindo a concorrência no atendimento a múltiplos clientes.
    tratarConexao(conexao);
}
