import cors from 'cors';
import http from 'http';
import express from 'express';
import { Server, Socket } from 'socket.io';

import { Global } from './store/global';
import { registerRoomHandlers } from './handlers/room';
import { registerUserHandlers } from './handlers/user';
import { registerGameHandlers } from './handlers/game';

const app = express().use(cors());
const global = Global.getInstance();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
}) as Server;

const onConnection = (socket: Socket) => {
    console.log('User Connected: ', socket.id);

    registerRoomHandlers(io, socket);
    registerUserHandlers(io, socket);
    registerGameHandlers(io, socket);

    socket.on('disconnect', () => {
        console.log('User Disconnected: ', socket.id);

        const roomId = socket.data.roomId;
        const users = global.getState().users;
        const usersFiltered = users.filter((user) => user.id !== socket.id);

        global.setState({
            ...global,
            users: usersFiltered
        });

        io.in(roomId).emit('users:update', usersFiltered);
    });
};

io.on('connection', onConnection);

server.listen(8000, () => {
    console.log('Servidor rodando na porta 8000');
});