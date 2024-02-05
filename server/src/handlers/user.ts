import { Server, Socket } from 'socket.io';
import { getUsersFilteredByRoom, updateUser } from '../utils/general';
import { Global } from '../store/global';
import { IUser } from '../types/user';

interface IOnReadyUser {
    roomId: string;
    isReady: boolean;
}

export const registerUserHandlers = (io: Server, socket: Socket) => {
    const global = Global.getInstance();

    const onReadyUser = ({ roomId, isReady }: IOnReadyUser) => {
        const users = global.getState().users;
        const newUsers = users.map((user) => {
            if (user.id === socket.id) {
                return {
                    ...user,
                    isReady: isReady
                };
            }

            return user;
        });

        global.setState({ ...global, users: newUsers });

        io.in(roomId).emit('users:update', getUsersFilteredByRoom(newUsers, roomId));
    };

    const onUpdateUser = (user: IUser) => {
        updateUser(user, io, global);
    };

    socket.on('user:on-ready', onReadyUser);
    socket.on('user:update', onUpdateUser);
};
