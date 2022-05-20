import * as http from "http";
import createApp from "./app";
import socketIO from "./src/sockets";

const app = createApp();
const server = http.createServer(app);
const corsOptions = {
    cors: true,
    origin: 'http://localhost:3000'
};
socketIO.attach(server, corsOptions);

server.listen(3001, () => {
    console.log('server on');
})