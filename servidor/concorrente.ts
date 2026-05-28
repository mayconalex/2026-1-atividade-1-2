const listener = Deno.listen({ port: 5000 });
console.log("Servidor CONCORRENTE escutando na porta 5000...");

async function tratarConexao(conexao: Deno.Conn) {
    console.log("[Nova Conexão] Cliente aceito.");
    const buffer = new Uint8Array(1024);

    try {
        while (true) {
            const bytesLidos = await conexao.read(buffer);
            if (!bytesLidos) {
                console.log("[Desconexão] Cliente encerrou a conexão.");
                break;
            }

            const mensagem = new TextDecoder().decode(buffer.subarray(0, bytesLidos));
            console.log(`[Recebido]: ${mensagem.trim()}`);
            await conexao.write(new TextEncoder().encode(`Echo: ${mensagem}`));
        }
    } catch (erro) {
        console.error("Erro na conexão:", erro);
    } finally {
        conexao.close();
    }
}

for await (const conexao of listener) {
    // A omissão do 'await' delega a execução ao Event Loop.
    // O loop continua instantaneamente, aceitando múltiplos clientes.
    tratarConexao(conexao);
}