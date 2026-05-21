// Inicia o servidor TCP na porta 5000
const listener = Deno.listen({ port: 5000 });
console.log("Servidor Echo TS escutando na porta 5000");

// Trata a conexão de um cliente de forma assíncrona
async function tratarConexao(conexao: Deno.Conn) {
    console.log(`[Nova Conexão] Cliente aceito`);

    const buffer = new Uint8Array(1024); // Buffer para receber os dados

    try {
        while (true) {
            // Lê os dados sem bloquear a thread principal (Event Loop)
            const bytesLidos = await conexao.read(buffer);

            if (!bytesLidos) {
                console.log("[Desconexão] Cliente saiu");
                break; // Encerra se o cliente desconectar
            }

            // Converte bytes para texto
            const mensagem = new TextDecoder().decode(
                buffer.subarray(0, bytesLidos)
            );
            console.log(`[Recebido]: ${mensagem.trim()}`);

            // Envia a mesma mensagem de volta (Echo)
            const resposta = new TextEncoder().encode(`Echo TS: ${mensagem}`);
            await conexao.write(resposta);
        }
    } catch (erro) {
        console.error("Erro na conexão:", erro);
    } finally {
        conexao.close(); // Fecha a conexão e libera recursos do S.O.
    }
}

// Loop principal para aceitar novas conexões
for await (const conexao of listener) {
    // Não usamos 'await' na chamada da função abaixo.
    // Isso permite atender múltiplos clientes simultaneamente de forma concorrente.
    tratarConexao(conexao);
}
