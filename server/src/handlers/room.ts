import { TPlayer } from "@shared/types/player";
import { Server, Socket } from "socket.io";
import { Global } from "../store/global";

type TConnectRoom = {
  roomId: string;
  playerName: string;
};

export const registerRoomHandlers = (io: Server, socket: Socket) => {
  const global = Global.getInstance();

  const connectRoom = ({ roomId, playerName }: TConnectRoom) => {
    const newPlayerData = {
      id: socket.id,
      name: playerName,
      roomId: roomId,
      isReady: false,
      cards: [],
      graveyard: [],
    } as TPlayer;

    const players = global.getRoomState(roomId).players;
    const newPlayers = [
      ...players.filter((player) => player.id !== socket.id),
      newPlayerData,
    ];

    global.updateRoomPlayers(roomId, newPlayers);

    const isNewRoom = !io.sockets.adapter.rooms.get(roomId);

    if (isNewRoom) {
      io.to(socket.id).emit("sv_game:get-deck");
    }

    socket.join(roomId);
    socket.data.roomId = roomId;

    io.in(roomId).emit(
      "sv_players:update",
      global.getRoomState(roomId).players
    );
  };

  socket.on("cl_room:connect", connectRoom);
};
