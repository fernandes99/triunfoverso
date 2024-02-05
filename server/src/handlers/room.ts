import { Server, Socket } from 'socket.io';
import { Global } from '../store/global';
import { IUser } from '../types/user';
import { getUsersFilteredByRoom } from '../utils/general';

interface IConnectRoom {
    roomId: string;
    userName: string;
}

export const registerRoomHandlers = (io: Server, socket: Socket) => {
    const global = Global.getInstance();

    const connectRoom = (props: IConnectRoom) => {
        const users = global.getState().users;
        const newUsers = [
            ...users.filter((user) => user.id !== socket.id),
            {
                id: socket.id,
                name: props.userName,
                roomId: props.roomId,
                isReady: false,
                cards: [],
                graveyard: []
            } as IUser
        ];

        socket.join(props.roomId);
        socket.data.roomId = props.roomId;

        global.setState({ ...global, users: newUsers });

        io.in(props.roomId).emit('users:update', getUsersFilteredByRoom(newUsers, props.roomId));
    };

    socket.on('room:connect', connectRoom);
};
