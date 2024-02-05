import { Server } from 'socket.io';
import { IUser } from '../types/user';

export const getUsersFilteredByRoom = (users: IUser[], roomId: string) => {
    return users.filter((user) => user.roomId === roomId);
};

export const updateUser = (user: IUser, io: Server, global: any) => {
    const users = global.getState().users as IUser[];
    const newUsers = users.map((u) => (u.id === user.id ? user : u));

    global.setState({ ...global, users: newUsers });

    io.in(user.roomId).emit('users:update', getUsersFilteredByRoom(newUsers, user.roomId));
};
