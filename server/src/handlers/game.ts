import { Server, Socket } from "socket.io";
import { Global } from "../store/global";

import { CARDS } from "@/constants/cards";
import { TDeck } from "@shared/types/deck";
import { TPlayer } from "@shared/types/player";
import { TTurn } from "@shared/types/turn";
import { shuffle } from "../utils/general";

type TOnStartGame = {
  roomId: string;
  playerName: string;
};

type TOnAddDeck = {
  roomId: string;
  deck: TDeck;
};

export const registerGameHandlers = (io: Server, socket: Socket) => {
  const global = Global.getInstance();

  const onStartGame = ({ roomId, playerName }: TOnStartGame) => {
    const { players, deck } = global.getRoomState(roomId);
    const playersUpdated = [
      ...(players.filter((player) => player.id !== socket.id) || []),
      {
        id: socket.id,
        name: playerName,
        isReady: true,
        cards: shuffle([...CARDS]),
        roomId,
      } as TPlayer,
    ];
    const turnUpdated = {
      currentPlayer: playersUpdated[0],
      roomId: roomId,
      round: 0,
      state: "initial",
      history: [`Vez de ${playersUpdated[0].name}`],
    } as TTurn;

    global.setRoomState(roomId, {
      players: playersUpdated,
      turn: turnUpdated,
      deck,
    });

    socket.join(roomId);
    socket.data.roomId = roomId;

    io.in(roomId).emit("sv_turn:update", turnUpdated);
    io.in(roomId).emit("sv_players:update", playersUpdated);
  };

  const onAddDeck = ({ roomId, deck }: TOnAddDeck) => {
    const currentDeck = global.getRoomState(roomId).deck;

    if (currentDeck?.id === deck.id) {
      return null;
    }

    global.setRoomDeck(roomId, deck);
    io.in(roomId).emit("sv_deck:update", deck);
  };

  socket.on("cl_game:on-start", onStartGame);
  socket.on("cl_game:add-deck", onAddDeck);
};
