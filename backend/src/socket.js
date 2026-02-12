// socket placeholder
import { Server } from "socket.io";

export function createSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: "*" }
  });

  io.on("connection", (socket) => {
    console.log("Client connected", socket.id);
    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
    });
  });

  return io;
}