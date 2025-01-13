import React, { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [client, setClient] = useState(null);
    const socketUrl = 'ws://localhost:8080/ws';  // Use the correct URL

    const handleNewMessage = (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
    };

    const handleError = (error) => {
        console.error('WebSocket error: ', error);
    };

    useEffect(() => {
        const stompClient = new Client({
            brokerURL: socketUrl,  // Use the socketUrl you defined
            reconnectDelay: 5000,
            debug: (str) => console.log('STOMP Debug: ' + str),
            onConnect: () => {
                console.log('WebSocket connected!');
                stompClient.subscribe('/topic/messages', (message) => {
                    console.log('Received message: ', message.body);
                    handleNewMessage(message.body);
                });
            },
            onWebSocketError: (error) => {
                console.error('WebSocket error:', error);
            },
            onStompError: (frame) => {
                console.error('STOMP error: ', frame);
            },
            onWebSocketClose: () => {
                console.log('WebSocket connection closed');
            }
        });

        stompClient.activate();
        setClient(stompClient);

        return () => {
            if (stompClient) {
                stompClient.deactivate();
                console.log('WebSocket disconnected');
            }
        };
    }, []);

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ width: '20%', borderRight: '1px solid #ccc', padding: '10px' }}>
                <h3>People</h3>
                <ul>
                    {/* List of people (to be implemented) */}
                    <li>User 1</li>
                    <li>User 2</li>
                </ul>
            </div>
            <div style={{ width: '80%', padding: '10px' }}>
                <h1>Chat</h1>
                <ul>
                    {messages.map((msg, index) => (
                        <li key={index}>{msg}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Chat;
