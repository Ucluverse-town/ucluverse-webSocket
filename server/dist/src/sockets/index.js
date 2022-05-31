"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const io = require('socket.io');
const socketIO = io();
const defaultMapSetting_1 = __importDefault(require("./utils/defaultMapSetting"));
const TYPE = {
    CONNECT: "connect",
    DISCONNECT: "disconnect",
    CREATE_ROOM: "CREATE_ROOM",
    JOIN_ROOM: "JOIN_ROOM",
    LEAVE_ROOM: "LEAVE_ROOM",
    SEND_MESSAGE: "SEND_MESSAGE",
    RECEIVE_MESSAGE: "RECEIVE_MESSAGE",
    CHARACTER_MOVE: "CHARACTER_MOVE",
};
const nearByDistance = 100;
const GATHER_ROOM_CODE = "ajou-gather";
const code = GATHER_ROOM_CODE;
let RoomList = {};
let RoomUser = {};
let userSocketList = [];
RoomList[code] = 0;
RoomUser[code] = {};
const findDefaultCharacterPosition = (mapId) => defaultMapSetting_1.default[mapId].character;
const findSocket = (id) => userSocketList.reduce((result, element) => element.id === id ? element.socket : result, "");
const includeUser = (list, user) => user.x - nearByDistance <= list.x &&
    list.x <= user.x + nearByDistance &&
    user.y - nearByDistance <= list.y &&
    list.y <= user.y + nearByDistance;
const isContain = (tempBackground, mapId) => {
    const temp = defaultMapSetting_1.default[mapId].defaultMargin;
    return (temp.minX <= tempBackground.top &&
        tempBackground.top <= temp.maxX &&
        temp.minY <= tempBackground.left &&
        tempBackground.left <= temp.maxY);
};
const findAdjacentUserList = (user) => Object.entries(RoomUser[code]).reduce((result, [keys, room]) => {
    if (keys !== user.id) {
        if (includeUser(room, user)) {
            result.push(findSocket(keys));
        }
    }
    else
        result.push(findSocket(keys));
    return result;
}, []);
socketIO.on("connect", (socket) => {
    console.log("socket connect", socket.id);
    socket.on(TYPE.JOIN_ROOM, (user, done) => {
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
    });
    socket.on(TYPE.LEAVE_ROOM, (user) => __awaiter(void 0, void 0, void 0, function* () {
        socket.leave(code);
        if (user.id) {
            try {
                delete RoomUser[code][user.id];
            }
            catch (e) {
                console.log(e);
            }
            socketIO.to(code).emit("makeRoomClient", RoomUser[code]);
            socketIO.to(code).emit("changeMove", RoomUser[code], null);
        }
    }));
    socket.on(TYPE.CHARACTER_MOVE, (props) => {
        const user = props.user;
        const tempBackground = props.tempBackground;
        console.log(user);
        if (socket.id) {
            RoomUser[code][socket.id] = user
                ? Object.assign({}, user) : {
                name: user.name,
                x: findDefaultCharacterPosition(RoomList[code]).x,
                y: findDefaultCharacterPosition(RoomList[code]).y,
                direction: "down",
                state: "mid",
                cId: user.cId,
            };
            socketIO
                .to(code)
                .emit("changeMove", RoomUser[code], isContain(tempBackground, RoomList[code])
                ? tempBackground
                : undefined);
        }
    });
    socket.on(TYPE.SEND_MESSAGE, (chat) => {
        const { status } = chat;
        if (status === "Everyone") {
            socket.broadcast.emit(TYPE.RECEIVE_MESSAGE, chat);
        }
        else if (status === "Nearby") {
            findAdjacentUserList(RoomUser[GATHER_ROOM_CODE][socket.id]).map((element) => socketIO.to(element).emit(TYPE.RECEIVE_MESSAGE, chat));
        }
        else {
            socket.to(status).emit(TYPE.RECEIVE_MESSAGE, chat);
        }
    });
    socket.on("disconnect", () => {
        console.log("disconnect", socket.id);
        delete RoomUser[code][socket.id];
    });
});
exports.default = socketIO;
//# sourceMappingURL=index.js.map