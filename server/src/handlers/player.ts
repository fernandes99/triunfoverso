import { Server, Socket } from "socket.io";
import { Global } from "../store/global";

interface IOnReadyPlayer {
  roomId: string;
  isReady: boolean;
}

export const registerPlayerHandlers = (io: Server, socket: Socket) => {
  const global = Global.getInstance();

  const onReadyPlayer = ({ roomId, isReady }: IOnReadyPlayer) => {
    global.updateRoomReadyPlayer(roomId, socket.id, isReady);
    io.in(roomId).emit(
      "sv_players:update",
      global.getRoomState(roomId).players
    );
  };

  socket.on("cl_player:on-ready", onReadyPlayer);
};
