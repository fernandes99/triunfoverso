import cors from "cors";
import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";

import { registerGameHandlers } from "./handlers/game";
import { registerPlayerHandlers } from "./handlers/player";
import { registerRoomHandlers } from "./handlers/room";
import { registerTurnHandlers } from "./handlers/turn";
import { Global } from "./store/global";

const port = process.env.PORT || 8000;
const app = express().use(cors());
const global = Global.getInstance();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
}) as Server;

const onConnection = (socket: Socket) => {
  console.log("Player Connected: ", socket.id);

  registerRoomHandlers(io, socket);
  registerPlayerHandlers(io, socket);
  registerGameHandlers(io, socket);
  registerTurnHandlers(io, socket);

  socket.on("disconnect", () => {
    console.log("Player Disconnected: ", socket.id);

    const roomId = socket.data.roomId as string;

    global.removeRoomPlayer(socket.data.roomId, socket.id);
    io.in(roomId).emit("players:update", global.getRoomState(roomId).players);
  });
};

io.on("connection", onConnection);

app.get("/", (_, res) => {
  console.log('Acesso à rota "/"');
  res.send("Olá, mundo!");
});

server.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
