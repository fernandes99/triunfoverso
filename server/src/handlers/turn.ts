import { Server, Socket } from "socket.io";
import { Global } from "../store/global";

import {
  getUsersFilteredByRoom,
  shuffle,
  updateTurnHistory,
} from "../utils/general";
import { ITurn } from "../types/turn";
import { IAttribute } from "../types/card";

interface IOnTurnPass {
  turn: ITurn;
}

interface IOnSelectAttribute {
  turn: ITurn;
  attribute: IAttribute;
}

export const registerTurnHandlers = (io: Server, socket: Socket) => {
  const global = Global.getInstance();

  const onTurnPass = (props: IOnTurnPass) => {
    const turn = global.getState().turn;
    const users = global.getState().users;
    const userFiltered = getUsersFilteredByRoom(users, props.turn.roomId);
    const currentUser = userFiltered[(turn?.round! + 1) % 2];
    const turnUpdated = {
      ...turn,
      currentUser: currentUser,
      round: turn?.round! + 1,
      history: updateTurnHistory(`Vez de ${currentUser.name}`, turn?.history!),
      state: "initial",
      result: null,
    } as ITurn;

    const usersUpdated = users.map((user) => {
      if (user.id === turn?.result?.winner?.id) {
        user.cards.shift();
        return user;
      }

      if (user.id === turn?.result?.loser?.id) {
        user.cards = [...user.cards, user.cards[0]];
        user.cards.shift();
        return user;
      }

      return user;
    });

    global.setState({ ...global, users: usersUpdated, turn: turnUpdated });

    io.in(props.turn.roomId).emit("turn:update", turnUpdated);
    io.in(props.turn.roomId).emit(
      "users:update",
      getUsersFilteredByRoom(usersUpdated, props.turn.roomId)
    );
  };

  const onSelectAttribute = (props: IOnSelectAttribute) => {
    const { users, turn } = global.getState();
    const userFiltered = getUsersFilteredByRoom(users, turn?.roomId!);
    const user = userFiltered.find((user) => user.id === socket.id);
    const enemy = userFiltered.find((user) => user.id !== socket.id);
    const attributesEnemy = enemy?.cards[0].attrs.find(
      (attr) => attr.attr.slug === props.attribute.attr.slug
    );
    const winner =
      props.attribute.value >= attributesEnemy?.value! ? user : enemy;
    const loser =
      props.attribute.value >= attributesEnemy?.value! ? enemy : user;
    const finishedGame = winner?.cards?.length && winner?.cards?.length <= 1;

    if (finishedGame && socket.id === winner.id) {
      io.to(socket.id).emit("game:you-win");
    }

    const turnUpdated = {
      ...props.turn,
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
    } as ITurn;

    global.setState({ ...global, users, turn: turnUpdated });

    io.in(props.turn.roomId).emit("turn:update", turnUpdated);
  };

  socket.on("turn:on-pass", onTurnPass);
  socket.on("turn:on-select-attribute", onSelectAttribute);
};
