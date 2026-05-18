import os
import socket
import threading


HOST = os.getenv("HOST", "127.0.0.1")
PORT = int(os.getenv("PORT", "5000"))
BUFFER_SIZE = 1024


def handle_client(conn: socket.socket, addr: tuple[str, int]) -> None:
    with conn:
        print(f"[echo-server] Conexão de {addr}")
        try:
            while True:
                data = conn.recv(BUFFER_SIZE)
                if not data:
                    print(f"[echo-server] Conexão encerrada por {addr}")
                    break
                conn.sendall(data)
        except OSError as error:
            print(f"[echo-server] Erro na conexão {addr}: {error}")


def main() -> None:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        sock.bind((HOST, PORT))
        sock.listen()
        print(f"[echo-server] Escutando em {HOST}:{PORT}")

        while True:
            conn, addr = sock.accept()
            thread = threading.Thread(target=handle_client, args=(conn, addr), daemon=True)
            thread.start()


if __name__ == "__main__":
    main()
