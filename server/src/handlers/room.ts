import { Server, Socket } from "socket.io";
import { Global } from "../store/global";
import { IPlayer } from "../types/player";

interface IConnectRoom {
  roomId: string;
  playerName: string;
}

export const registerRoomHandlers = (io: Server, socket: Socket) => {
  const global = Global.getInstance();

  const connectRoom = ({ roomId, playerName }: IConnectRoom) => {
    const newPlayerData = {
      id: socket.id,
      name: playerName,
      roomId: roomId,
      isReady: false,
      cards: [],
      graveyard: [],
    } as IPlayer;

    const players = global.getRoomState(roomId).players;
    const newPlayers = [
      ...players.filter((player) => player.id !== socket.id),
      newPlayerData,
    ];

    global.updateRoomPlayers(roomId, newPlayers);

    socket.join(roomId);
    socket.data.roomId = roomId;

    io.in(roomId).emit(
      "sv_players:update",
      global.getRoomState(roomId).players
    );
  };

  socket.on("cl_room:connect", connectRoom);
};
