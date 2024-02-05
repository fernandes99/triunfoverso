import { Server, Socket } from 'socket.io';
import { Global } from '../store/global';

import { getUsersFilteredByRoom } from '../utils/general';
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
        const newUsers = [
            ...users.filter((user) => user.id !== socket.id),
            {
                id: socket.id,
                name: userName,
                isReady: true,
                cards: CARDS,
                graveyard: [],
                roomId
            } as IUser
        ];

        const userFiltered = getUsersFilteredByRoom(users, roomId);
        const turnData = {
            currentUser: userFiltered[0],
            roomId: roomId,
            round: 0,
            title: ''
        } as ITurn;

        global.setState({ ...global, users: newUsers });

        socket.join(roomId);
        socket.data.roomId = roomId;

        io.in(roomId).emit('turn:update', turnData);
        io.in(roomId).emit('users:update', getUsersFilteredByRoom(newUsers, roomId));
    };

    socket.on('game:on-start', onStartGame);
};
