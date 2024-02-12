import { Server, Socket } from 'socket.io';
import { Global } from '../store/global';

import { getUsersFilteredByRoom, shuffle, updateTurnHistory } from '../utils/general';
import { ITurn } from '../types/turn';
import { CARDS } from '../constants/cards';
import { IUser } from '../types/user';
import { IAttribute } from '../types/card';

interface IOnStartGame {
    roomId: string;
    userName: string;
}

interface IOnTurnPass {
    turn: ITurn;
}

interface IOnSelectAttribute {
    turn: ITurn;
    attribute: IAttribute;
}

export const registerGameHandlers = (io: Server, socket: Socket) => {
    const global = Global.getInstance();

    const onStartGame = ({ roomId, userName }: IOnStartGame) => {
        const users = global.getState().users;
        const usersUpdated = [
            ...(users.filter((user) => user.id !== socket.id) || []),
            {
                id: socket.id,
                name: userName,
                isReady: true,
                cards: shuffle([...CARDS]),
                roomId
            } as IUser
        ];
        const userFiltered = getUsersFilteredByRoom(usersUpdated, roomId);
        const turnUpdated = {
            currentUser: userFiltered[0],
            roomId: roomId,
            round: 0,
            state: 'initial',
            history: [`Vez de ${userFiltered[0].name}`]
        } as ITurn;

        global.setState({ ...global, users: usersUpdated, turn: turnUpdated });

        socket.join(roomId);
        socket.data.roomId = roomId;

        io.in(roomId).emit('turn:update', turnUpdated);
        io.in(roomId).emit('users:update', userFiltered);
    };

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
            history: updateTurnHistory(
                props.attribute.value >= attributesEnemy?.value!
                    ? `${user?.name} ganhou a rodada!`
                    : `${enemy?.name} ganhou a rodada!`,
                turn?.history!
            ),
            title:
                props.attribute.value >= attributesEnemy?.value!
                    ? `${user?.name} ganhou a rodada!`
                    : `${enemy?.name} ganhou a rodada!`
        } as ITurn;

        global.setState({ ...global, users, turn: turnUpdated });

        io.in(props.turn.roomId).emit('turn:update', turnUpdated);
    };

    socket.on('game:on-start', onStartGame);
    socket.on('turn:on-pass', onTurnPass);
    socket.on('turn:on-select-attribute', onSelectAttribute);
};
