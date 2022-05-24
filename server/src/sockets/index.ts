
const io = require('socket.io');
const socketIO = io();

socketIO.on('connect', (socket: any) => {
    socket.on('move', (coordinate: any) => {
        console.log(coordinate);
        socketIO.emit('move', { coordinate: coordinate });
    });
});

export default socketIO;