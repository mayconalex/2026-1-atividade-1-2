const host = Deno.env.get("SERVER_HOST") || "127.0.0.1";

console.log(`Conectando a ${host}:5000...`);
const conexao = await Deno.connect({ hostname: host, port: 5000 });

const buffer = new Uint8Array(1024);

try {
    const mensagem = `Mensagem automática de teste`;
    await conexao.write(new TextEncoder().encode(mensagem));

    const bytesLidos = await conexao.read(buffer);
    if (bytesLidos) {
        const resposta = new TextDecoder().decode(
            buffer.subarray(0, bytesLidos)
        );
        console.log(`Servidor respondeu: ${resposta}`);
    }

    // Retém a conexão aberta por 2 segundos para teste de concorrência
    await new Promise((resolve) => setTimeout(resolve, 2000));
} catch (erro) {
    console.error(`Erro:`, erro);
} finally {
    conexao.close();
    console.log(`Finalizado.`);
}
