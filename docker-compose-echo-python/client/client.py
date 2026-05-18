import os
import socket
import time


HOST = os.getenv("ECHO_HOST", "echo-server")
PORT = int(os.getenv("ECHO_PORT", "5000"))
MESSAGE = os.getenv("ECHO_MESSAGE", "Olá do cliente echo!")


def main() -> None:
    max_attempts = 15
    for attempt in range(1, max_attempts + 1):
        try:
            with socket.create_connection((HOST, PORT), timeout=5) as sock:
                print(f"[echo-client] Conectado em {HOST}:{PORT}")
                sock.sendall(MESSAGE.encode("utf-8"))
                response = sock.recv(1024).decode("utf-8")
                print(f"[echo-client] Enviado:  {MESSAGE}")
                print(f"[echo-client] Recebido: {response}")

                if response != MESSAGE:
                    raise RuntimeError("Resposta recebida difere da mensagem enviada.")
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
