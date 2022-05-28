
const io = require('socket.io');
const socketIO = io();

interface userListType{
 [key: string]: {x:number;y:number;}
}

let userInfo:userListType = {};

socketIO.on('connect', (socket: any) => {
    console.log('connected');
    userInfo[socket.id] =  { x: 0, y: 0 };
    console.log(userInfo);
    socketIO.emit('set_userInfo', userInfo);
    socketIO.emit('draw_move', userInfo);
    socket.on('disconnect', () => {
        console.log('disconnect');
        delete userInfo[socket.id];
    });

    socket.on('move', (coordinate: any) => {
        userInfo[socket.id].x = coordinate.x;
        userInfo[socket.id].y = coordinate.y;
        console.log(userInfo);
        socketIO.emit('draw_move', userInfo);
    });
});

export default socketIO;


// socketIO.emit시 client에서 데이터를 받지 못하는 이유
// => Note: Map and Set are not serializable and must be manually serialized

