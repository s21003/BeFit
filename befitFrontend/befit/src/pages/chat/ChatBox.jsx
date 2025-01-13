import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';

function ChatBox({ sessionId }) {
    const [messages, setMessages] = useState([]);
    const messagesRef = useRef([]);
    const [newMessage, setNewMessage] = useState('');
    const stompClientRef = useRef(null);
    const isConnectedRef = useRef(false);

    useEffect(() => {
        console.log('ChatBox useEffect called');

        if (isConnectedRef.current) {
            console.log('Already connected or connecting, skipping connection.');
            return;
        }

        const token = localStorage.getItem('token');

        if (token && sessionId) {
            isConnectedRef.current = true;

            const socket = new SockJS(`http://localhost:8080/ws?access_token=${token}&sessionId=${sessionId}`);
            const client = over(socket);

            client.connect(
                {},
                (frame) => {
                    console.log('Connected: ' + frame);
                    stompClientRef.current = client;

                    client.subscribe(`/topic/messages/${sessionId}`, (message) => {
                        if (message.body) {
                            const messageObj = JSON.parse(message.body);
                            setMessages((prevMessages) => {
                                const updatedMessages = [...prevMessages, messageObj];
                                messagesRef.current = updatedMessages;
                                return updatedMessages;
                            });
                        }
                    });

                    client.subscribe(`/topic/session-users/${sessionId}`, (userList) => {
                        console.log('Session users updated:', userList.body);
                    });
                },
                (error) => {
                    console.error('STOMP error', error);
                    isConnectedRef.current = false;
                }
            );
        }

        return () => {
            console.log('Chat cleanup function called');
            if (stompClientRef.current) {
                stompClientRef.current.disconnect(() => {
                    console.log('Disconnected from WebSocket');
                });
                stompClientRef.current = null;
                isConnectedRef.current = false;
            }
        };
    }, [sessionId]);

    const sendMessage = () => {
        if (stompClientRef.current && newMessage.trim() !== '') {
            const message = {
                content: newMessage,
            };
            stompClientRef.current.send(`/app/chat/${sessionId}`, {}, JSON.stringify(message));
            setNewMessage('');
        }
    };

    return (
            <div className="chat">
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

export default ChatBox;