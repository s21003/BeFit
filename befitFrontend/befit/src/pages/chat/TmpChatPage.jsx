import React, { useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from "sockjs-client";

const TmpChatPage = () => {
    useEffect(() => {
        // Configure STOMP client
        const client = new Client({
            brokerURL: 'ws://localhost:9090/ws',

            //webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            // If using SockJS, disable brokerURL and use webSocketFactory
            // webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            reconnectDelay: 5000, // Automatically reconnect on connection loss
            debug: (str) => console.log(str), // Debugging logs
            onConnect: () => {
                console.log('Connected to WebSocket');
                client.subscribe('/topic/messages', (message) => {
                    console.log('Message received:', message.body);
                });
            },
            onStompError: (frame) => {
                console.error('Broker error:', frame.headers['message']);
            },
        });

        // Activate the STOMP client
        client.activate();

        // Cleanup function
        return () => {
            client.deactivate();
        };
    }, []);

    return <div>WebSocket Chat Page</div>;
};

export default TmpChatPage;
