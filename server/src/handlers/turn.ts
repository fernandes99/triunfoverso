import { Server, Socket } from 'socket.io';
import { Global } from '../store/global';

import { getUsersFilteredByRoom, shuffle } from '../utils/general';
import { ITurn } from '../types/turn';
import { IAttribute } from '../types/card';

interface IOnTurnPass {
    turn: ITurn;
}

interface IOnSelectAttribute {
    turn: ITurn;
    attribute: IAttribute;
}

export const registerGameHandlers = (io: Server, socket: Socket) => {
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
            title: `Vez de ${currentUser.name}`,
            state: 'initial'
        } as ITurn;

        io.in(props.turn.roomId).emit('turn:update', turnUpdated);
    };

    const onSelectAttribute = (props: IOnSelectAttribute) => {
        const { users, turn } = global.getState();
        const userFiltered = getUsersFilteredByRoom(users, turn?.roomId!);
        const user = userFiltered.find((user) => user.id === socket.id);
        const enemy = userFiltered.find((user) => user.id !== socket.id);
        const attributesEnemy = enemy?.cards[0].attrs.find(
            (attr) => attr.attr.slug === props.attribute.attr.slug
        );

        const turnUpdated = {
            ...props.turn,
            state: 'finished',
            title:
                props.attribute.value >= attributesEnemy?.value!
                    ? `${user?.name} ganhou a rodada!`
                    : `${enemy?.name} ganhou a rodada!`
        } as ITurn;

        global.setState({ ...global, users, turn: turnUpdated });

        io.in(props.turn.roomId).emit('turn:update', turnUpdated);
    };

    socket.on('turn:on-pass', onTurnPass);
    socket.on('turn:on-select-attribute', onSelectAttribute);
};
