import { Server, Socket } from "socket.io";
import { Global } from "../store/global";

import { CARDS } from "../constants/cards";
import { IPlayer } from "../types/player";
import { ITurn } from "../types/turn";
import { shuffle } from "../utils/general";

interface IOnStartGame {
  roomId: string;
  playerName: string;
}

export const registerGameHandlers = (io: Server, socket: Socket) => {
  const global = Global.getInstance();

  const onStartGame = ({ roomId, playerName }: IOnStartGame) => {
    const players = global.getRoomState(roomId).players;
    const playersUpdated = [
      ...(players.filter((player) => player.id !== socket.id) || []),
      {
        id: socket.id,
        name: playerName,
        isReady: true,
        cards: shuffle([...CARDS]),
        roomId,
      } as IPlayer,
    ];
    const turnUpdated = {
      currentPlayer: playersUpdated[0],
      roomId: roomId,
      round: 0,
      state: "initial",
      history: [`Vez de ${playersUpdated[0].name}`],
    } as ITurn;

    global.setRoomState(roomId, {
      players: playersUpdated,
      turn: turnUpdated,
    });

    socket.join(roomId);
    socket.data.roomId = roomId;

    io.in(roomId).emit("sv_turn:update", turnUpdated);
    io.in(roomId).emit("players:update", playersUpdated);
  };

  socket.on("cl_game:on-start", onStartGame);
};
