
const io = require('socket.io');
const socketIO = io();

socketIO.on('connect', (socket: any) => {
    console.log('socket connect');

    socket.on('message', (message: string) => {
        console.log(message);
    });
});

export default socketIO;