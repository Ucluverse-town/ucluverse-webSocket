
const io = require('socket.io');
const socketIO = io();

import defaultMapSetting from "./utils/defaultMapSetting";


const TYPE = {
    CONNECT: "connect",
    DISCONNECT: "disconnect",
    CREATE_ROOM: "CREATE_ROOM",
    JOIN_ROOM: "JOIN_ROOM",
    LEAVE_ROOM: "LEAVE_ROOM",
    SEND_MESSAGE: "SEND_MESSAGE",
    RECEIVE_MESSAGE: "RECEIVE_MESSAGE",
    CHARACTER_MOVE: "CHARACTER_MOVE",
  }
const nearByDistance = 100;
const GATHER_ROOM_CODE: string = "ajou-gather";
interface IUser {
  name: string;
  id: string;
  cId: number;
}

interface IUserList {
  id: string;
  socket: string;
}
interface IChat {
  status: string;
  text: string;
  name: string;
  cId: number;
  date: number;
  id: string;
}
interface IUserData {
  name: string;
  cId: number;
  x: number;
  y: number;
  direction: string;
  state: string;
}

interface IChatData {
    socketId: string;
    message: string;
}

const code = GATHER_ROOM_CODE;
let RoomList: any = {};
let RoomUser: any = {};
let userSocketList: IUserList[] = [];

RoomList[code] = 0;
RoomUser[code] = {};

  const findDefaultCharacterPosition = (mapId: number) =>
    defaultMapSetting[mapId].character;
  
  const findSocket = (id: string) =>
    userSocketList.reduce(
      (result: string, element: IUserList) =>
        element.id === id ? element.socket : result,
      ""
    );
  
  const includeUser = (list: any, user: any) =>
    user.x - nearByDistance <= list.x &&
    list.x <= user.x + nearByDistance &&
    user.y - nearByDistance <= list.y &&
    list.y <= user.y + nearByDistance;
  
  const isContain = (tempBackground: any, mapId: number) => {
    const temp = defaultMapSetting[mapId].defaultMargin;
    return (
      temp.minX <= tempBackground.top &&
      tempBackground.top <= temp.maxX &&
      temp.minY <= tempBackground.left &&
      tempBackground.left <= temp.maxY
    );
  };
  
  const findAdjacentUserList = (user: IUser) =>
    Object.entries(RoomUser[code]).reduce((result: string[], [keys, room]) => {
      if (keys !== user.id) {
        if (includeUser(room, user)) {
          result.push(findSocket(keys));
        }
      } else result.push(findSocket(keys));
      return result;
    }, []);

    socketIO.on("connect", (socket: any) => {
      console.log("socket connect", socket.id);
  
      socket.on(
        TYPE.JOIN_ROOM,
        (user: IUser, done: (userData: IUserData) => void) => {
          socket.join(code);
          userSocketList.push({ id: user.id, socket: socket.id });
          if (user.id) {
            RoomUser[code][user.id] = {
              name: user.name,
              x: 1800,
              y: 1800,
              direction: "down",
              state: "mid",
              cId: user.cId,
            };
  
            done({
              name: user.name,
              x: 1800,
              y: 1800,
              direction: "down",
              state: "mid",
              cId: user.cId,
            });
            socketIO.to(code).emit("makeRoomClient", RoomUser[code]);
          }
        }
      );
  
      socket.on(TYPE.LEAVE_ROOM, async (user: IUser) => {
        socket.leave(code);
        if (user.id) {
          try {
            delete RoomUser[code][user.id];
          } catch (e) {
            console.log(e);
          }
          socketIO.to(code).emit("makeRoomClient",  RoomUser[code]);
          socketIO.to(code).emit("changeMove", RoomUser[code], null);
        }
      });
  
      socket.on(TYPE.CHARACTER_MOVE, (props: any) => {
        const user: any = props.user;
        const tempBackground: any = props.tempBackground;
        console.log(user);
        if (socket.id) {
          RoomUser[code][socket.id] = user
            ? {
                ...user,
              }
            : {
                name: user.name,
                x: findDefaultCharacterPosition(RoomList[code]).x,
                y: findDefaultCharacterPosition(RoomList[code]).y,
                direction: "down",
                state: "mid",
                cId: user.cId,
              };
          socketIO
            .to(code)
            .emit(
              "changeMove",
              RoomUser[code],
              isContain(tempBackground, RoomList[code])
                ? tempBackground
                : undefined
            );
        }
      });
  
    //   socket.on(TYPE.SEND_MESSAGE, (chat: IChat) => {
    //     const { status } = chat;
    //     if (status === "Everyone") {
    //       socket.broadcast.emit(TYPE.RECEIVE_MESSAGE, chat);
    //     } else if (status === "Nearby") {
    //       findAdjacentUserList(
    //         RoomUser[GATHER_ROOM_CODE][socket.id],
    //       ).map((element: string) =>
    //         socketIO.to(element).emit(TYPE.RECEIVE_MESSAGE, chat)
    //       );
    //     } else {
    //       socket.to(status).emit(TYPE.RECEIVE_MESSAGE, chat);
    //     }
    //   });
      socket.on(TYPE.SEND_MESSAGE, (chatData: IChatData) => {
          console.log(chatData);
          socketIO.emit(TYPE.RECEIVE_MESSAGE, (chatData));
      })
      socket.on("disconnect", () => {
        console.log("disconnect", socket.id);
        delete RoomUser[code][socket.id];
      });
    });


  export default socketIO;