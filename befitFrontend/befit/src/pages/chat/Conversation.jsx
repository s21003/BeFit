import React, {useEffect, useRef, useState} from 'react';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import "../../styles/Conversations.css"

function Conversation({senderUsername}) {
    const [messages, setMessages] = useState([]);
    const messagesRef = useRef([]);
    const [newMessage, setNewMessage] = useState('');
    const stompClientRef = useRef(null);
    const isConnectedRef = useRef(false);

    const token = localStorage.getItem('token');

    useEffect(() => {
        console.log('Conversation useEffect called');

        if (isConnectedRef.current) {
            console.log('Already connected or connecting, skipping connection.');
            return;
        }



        if (token) {
            isConnectedRef.current = true; // Set flag immediately

            const socket = new SockJS(`http://localhost:8080/ws?access_token=${token}&senderUsername=${senderUsername}`);
            const client = over(socket);


            client.connect({}, (frame) => {
                console.log('Connected: ' + frame);
                stompClientRef.current = client;

                // Subscribe to the topic for this session
                client.subscribe(`/topic/messages/${senderUsername}`, (message) => {
                    if (message.body) {
                        const messageObj = JSON.parse(message.body);
                        setMessages((prevMessages) => {
                            const updatedMessages = [...prevMessages, messageObj];
                            messagesRef.current = updatedMessages;
                            return updatedMessages;
                        });
                    }
                });
            }, (error) => {
                console.error('STOMP error', error);
                isConnectedRef.current = false; // Reset on error
            });
        }

        return () => {
            console.log('Conversation cleanup function called');
            if (stompClientRef.current !== null) {
                stompClientRef.current.disconnect(() => {
                    console.log('Disconnected');
                });
                isConnectedRef.current = false;
            }
        };
    }, []);


    const sendMessage = () => {
        if (stompClientRef.current && newMessage.trim() !== '') {
            const message = {
                content: newMessage,
            };
            stompClientRef.current.send(`/app/chat/${senderUsername}`, {}, JSON.stringify(message));
            setNewMessage('');
        }
    };

    return (
        <div className="conversation">
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index}>
                        <b>{msg.sender}:</b> {msg.content}
                    </div>
                ))}
            </div>
            <div className="input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}

export default Conversation;