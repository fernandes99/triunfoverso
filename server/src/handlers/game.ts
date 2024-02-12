import { Server, Socket } from 'socket.io';
import { Global } from '../store/global';

import { getUsersFilteredByRoom, shuffle, updateTurnHistory } from '../utils/general';
import { ITurn } from '../types/turn';
import { CARDS } from '../constants/cards';
import { IUser } from '../types/user';

interface IOnStartGame {
    roomId: string;
    userName: string;
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

    socket.on('game:on-start', onStartGame);
};
