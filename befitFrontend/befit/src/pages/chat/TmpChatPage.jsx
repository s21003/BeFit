import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const TmpChatPage = () => {
    const [messages, setMessages] = useState();
    const [message, setMessage] = useState('');

    useEffect(() => {
        const socket = SockJS('http://localhost:8080/ws');
        const stompClient = Stomp.over(socket);

        const token = localStorage.getItem('token'); // Get your JWT token

        stompClient.connect({ Authorization: `Bearer ${token}` }, (frame) => {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/public', (message) => {
                setMessages(prevMessages => [...prevMessages, JSON.parse(message.body)]);
            });

            // Send a message to join the chat
            stompClient.send("/app/chat.addUser", {}, JSON.stringify({ sender: 'user123', type: 'JOIN' }));
        });

        return () => {
            if (stompClient) {
                stompClient.disconnect();
            }
        };
    },);

    //... (rest of your chat component logic)
};

export default TmpChatPage;