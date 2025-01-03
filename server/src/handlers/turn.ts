import { Server, Socket } from "socket.io";
import { Global } from "../store/global";

import { TCardAttribute } from "@shared/types/card";
import { TTurn } from "@shared/types/turn";
import { updateTurnHistory } from "../utils/general";

interface IOnTurnPass {
  roomId: string;
}

interface IOnSelectAttribute {
  roomId: string;
  turn: TTurn;
  attribute: TCardAttribute;
}

export const registerTurnHandlers = (io: Server, socket: Socket) => {
  const global = Global.getInstance();

  const onTurnPass = ({ roomId }: IOnTurnPass) => {
    const { turn, players } = global.getRoomState(roomId);
    const currentPlayer = players[(turn?.round! + 1) % 2];
    const turnUpdated = {
      ...turn,
      currentPlayer: currentPlayer,
      round: turn?.round! + 1,
      history: updateTurnHistory(
        `Vez de ${currentPlayer.name}`,
        turn?.history!
      ),
      state: "initial",
      result: null,
    } as TTurn;
    const playersUpdated = players.map((player) => {
      if (player.id === turn?.result?.winner?.id) {
        player.cards.shift();
        return player;
      }

      if (player.id === turn?.result?.loser?.id) {
        player.cards = [...player.cards, player.cards[0]];
        player.cards.shift();
        return player;
      }

      return player;
    });

    global.setRoomState(roomId, {
      ...global.getRoomState(roomId),
      players: playersUpdated,
      turn: turnUpdated,
    });

    io.in(roomId).emit("sv_turn:update", turnUpdated);
    io.in(roomId).emit("sv_players:update", playersUpdated);
  };

  const onSelectAttribute = ({
    roomId,
    turn: turnUpdatedData,
    attribute,
  }: IOnSelectAttribute) => {
    const { turn, players } = global.getRoomState(roomId);
    const player = players.find((player) => player.id === socket.id);
    const enemy = players.find((player) => player.id !== socket.id);
    const attributesEnemy = enemy?.cards[0].attrs.find(
      (attr) => attr.attr.slug === attribute.attr.slug
    );
    const winner = attribute.value >= attributesEnemy?.value! ? player : enemy;
    const loser = attribute.value >= attributesEnemy?.value! ? enemy : player;
    const finishedGame = winner?.cards?.length && winner?.cards?.length <= 1;

    if (finishedGame && socket.id === winner.id) {
      io.to(socket.id).emit("sv_game:you-win");
    }

    if (finishedGame && socket.id === loser?.id) {
      io.to(socket.id).emit("sv_game:you-lose");
    }

    const turnUpdated = {
      ...turnUpdatedData,
      state: "finished",
      result: {
        winner,
        loser,
      },
      history: updateTurnHistory(
        finishedGame
          ? `${winner?.name} ganhou o jogo!`
          : `${winner?.name} ganhou a rodada!`,
        turn?.history!
      ),
    } as TTurn;

    global.setRoomState(roomId, {
      ...global.getRoomState(roomId),
      players,
      turn: turnUpdated,
    });

    io.in(roomId).emit("sv_turn:update", turnUpdated);
  };

  socket.on("cl_turn:on-pass", onTurnPass);
  socket.on("cl_turn:on-select-attribute", onSelectAttribute);
};
