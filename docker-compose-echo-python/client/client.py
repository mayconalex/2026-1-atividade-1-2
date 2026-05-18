import os
import socket
import time


HOST = os.getenv("ECHO_HOST", "echo-server")
PORT = int(os.getenv("ECHO_PORT", "5000"))
MESSAGE = os.getenv("ECHO_MESSAGE", "Olá do cliente echo!")
BUFFER_SIZE = 1024
MAX_CONNECTION_ATTEMPTS = 15
CONNECTION_TIMEOUT_SECONDS = 5


def main() -> None:
    max_attempts = MAX_CONNECTION_ATTEMPTS
    for attempt in range(1, max_attempts + 1):
        try:
            with socket.create_connection((HOST, PORT), timeout=CONNECTION_TIMEOUT_SECONDS) as sock:
                print(f"[echo-client] Conectado em {HOST}:{PORT}")
                sock.sendall(MESSAGE.encode("utf-8"))
                sock.shutdown(socket.SHUT_WR)

                chunks = []
                while True:
                    chunk = sock.recv(BUFFER_SIZE)
                    if not chunk:
                        break
                    chunks.append(chunk)

                response = b"".join(chunks).decode("utf-8")
                print(f"[echo-client] Enviado:  {MESSAGE}")
                print(f"[echo-client] Recebido: {response}")

                if response != MESSAGE:
                    raise RuntimeError(
                        "Resposta recebida difere da mensagem enviada. "
                        f"Esperado: {MESSAGE}. Recebido: {response}."
                    )
                return
        except OSError as error:
            print(
                f"[echo-client] Tentativa {attempt}/{max_attempts} falhou: {error}. "
                "Aguardando servidor..."
            )
            time.sleep(1)

    raise RuntimeError("Não foi possível conectar ao servidor echo.")


if __name__ == "__main__":
    main()
