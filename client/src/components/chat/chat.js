import { useEffect, useState } from "react";
import socket from '../../utils/socket';
import './chat.scss';

const Chat = (socketId) => {
    const [receivedChatData, setReceivedChatData] = useState({ socketId: '', message: '' });
    const [chatHtml, setChatHtml] = useState('');

    


    useEffect(() => {
        socket.on('RECEIVE_MESSAGE', (chatData) => {
            setReceivedChatData(chatData);
            setChatHtml(prev => prev + `<p class="Nickname">${chatData.socketId}</p> <p class="Content">${chatData.message}<p>`);
        });
        return () => socket.off('RECEIVE_MESSAGE');
    })

    useEffect(() => {
        
    }, [receivedChatData]);

    useEffect(() => {
        const autoScroll = document.querySelector(".chatStyle"); 
        autoScroll.scrollTop = autoScroll.scrollHeight;
    });

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

    return <div className="chat chatBlockStyle">
        <div className="chatTitle">
            <h2>Chat</h2>
        </div>
        <div className="chatContainer">
            <div className="chatStyle" dangerouslySetInnerHTML={{__html:chatHtml}} />
        </div>
        <form claasName="formStyle" onSubmit={handleSubmit}>
            <input placeholder="Insert whatever" />
            {/* <button>😎</button> */}
        </form>
    </div>
}

export default Chat;