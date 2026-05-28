const host = Deno.env.get("SERVER_HOST") || "127.0.0.1";
// Gera um ID aleatório para identificar cada um dos 10 clientes no log
const id = Math.floor(Math.random() * 1000).toString().padStart(3, "0");

console.log(`[Cliente ${id}] Conectando a ${host}:5000...`);
const conexao = await Deno.connect({ hostname: host, port: 5000 });
console.log(`[Cliente ${id}] Conexão estabelecida.`);

const buffer = new Uint8Array(1024);

try {
    const mensagem = `Mensagem automática do Cliente ${id}`;
    await conexao.write(new TextEncoder().encode(mensagem));

    // Aguarda a resposta do servidor
    const bytesLidos = await conexao.read(buffer);
    if (bytesLidos) {
        const resposta = new TextDecoder().decode(buffer.subarray(0, bytesLidos));
        console.log(`[Cliente ${id}] Servidor respondeu: ${resposta}`);
    }

    // Retém a conexão aberta por 3 segundos antes de encerrar.
    // Isso forçará o servidor sequencial a deixar outros clientes na fila de espera.
    await new Promise((resolve) => setTimeout(resolve, 3000));

} catch (erro) {
    console.error(`[Cliente ${id}] Erro:`, erro);
} finally {
    conexao.close();
    console.log(`[Cliente ${id}] Finalizado.`);
}