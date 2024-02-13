import { io } from 'socket.io-client';

const URL = 'https://triunfoverso.onrender.com:8000/';

export const socket = io(URL);

// export const socket = new WebSocket('ws://localhost:8000/ws')
