import { useEffect, useState } from "react";
import socket from '../utils/socket';
const Chat = (socketId) => {
    const [receivedChatData, setReceivedChatData] = useState({ socketId: '', message: '' });
    const [chatHtml, setChatHtml] = useState('');
    const chatBlockStyle = {
        top: "0px",
        left: window.innerWidth - 350,
        width: 350,
        height: window.innerHeight,
        position: "absolute",
        background: "#172150"
    }

    const chatStyle = {
        overflow: 'scroll',
        top: "0px",
        left: window.innerWidth - 350,
        width: 350,
        height: window.innerHeight-30,
        background: "ffff"
    }

    const formStyle = {
        position: "absolute",
        top: window.innerHeight - 30,
        left: window.innerWidth - 1450,
    }

    useEffect(() => {
        socket.on('RECEIVE_MESSAGE', (chatData) => {
            setReceivedChatData(chatData);
            setChatHtml(prev => prev + `<p>${chatData.socketId} : ${chatData.message}<p>`);
        });
        return () => socket.off('RECEIVE_MESSAGE');
    })

    useEffect(() => {
        
    }, [receivedChatData]);

    const handleSubmit = (e) => {
        e.preventDefault();        
        const message = e.target[0].value;
        if (message.length > 0) {
            e.target[0].value = '';
            socket.emit('SEND_MESSAGE', ({ 
                socketId: socketId.socketId, 
                message: message
            }));
        }
    }

    return <div style={chatBlockStyle} className="chat">
        <div style={chatStyle} dangerouslySetInnerHTML={{__html:chatHtml}}></div>
        <form style={formStyle} onSubmit={handleSubmit}>
            <input placeholder="Insert whatever"></input>
            <button>SEND</button>
        </form>
    </div>
}

export default Chat;