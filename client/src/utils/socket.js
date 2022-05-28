import io from 'socket.io-client';

export default io('192.168.18.245:3001', { reconnection: true });