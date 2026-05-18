import os
import socket


HOST = "0.0.0.0"
PORT = int(os.getenv("PORT", "5000"))


def main() -> None:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        sock.bind((HOST, PORT))
        sock.listen()
        print(f"[echo-server] Escutando em {HOST}:{PORT}")

        while True:
            conn, addr = sock.accept()
            with conn:
                print(f"[echo-server] Conexão de {addr}")
                while True:
                    data = conn.recv(1024)
                    if not data:
                        break
                    conn.sendall(data)


if __name__ == "__main__":
    main()
