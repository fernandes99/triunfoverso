import { Server } from 'socket.io';
import { IUser } from '../types/user';
import { ITurn } from '../types/turn';

export const getUsersFilteredByRoom = (users: IUser[], roomId: string) => {
    return users.filter((user) => user.roomId === roomId);
};

export const updateUser = (user: IUser, io: Server, global: any) => {
    const users = global.getState().users as IUser[];
    const newUsers = users.map((u) => (u.id === user.id ? user : u));

    global.updateUsers(newUsers);

    io.in(user.roomId).emit('users:update', getUsersFilteredByRoom(newUsers, user.roomId));
};

export const shuffle = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

export const updateTurnHistory = (value: string, currentTurnHistory: ITurn['history']) => {
    if (!currentTurnHistory) {
        return [value];
    }

    if (currentTurnHistory.length > 2) {
        currentTurnHistory.pop();
    }

    return [value, ...currentTurnHistory];
};
