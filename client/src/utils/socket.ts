import { io } from 'socket.io-client';

const URL =
    process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8000'
        : 'http://localhost:8000';

export const socket = io(URL);
