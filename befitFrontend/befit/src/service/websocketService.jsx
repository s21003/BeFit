import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const socketUrl = 'http://localhost:8080/chat';

let client;

function initializeWebSocket(onMessageReceived, token) {
    client = new Client({
        webSocketFactory: () => new SockJS(socketUrl),
        reconnectDelay: 5000,
        connectHeaders: {
            Authorization: `Bearer ${token}`,
        },
        onConnect: () => {
            console.log("WebSocket connected");

            client.subscribe('/topic/messages', (message) => {
                if (onMessageReceived) {
                    onMessageReceived(JSON.parse(message.body));
                }
            });
        },
        onStompError: (frame) => {
            console.error("STOMP error:", frame.headers['message']);
        },
        onWebSocketClose: () => {
            console.warn("WebSocket connection closed. Attempting to reconnect...");
        },
        onWebSocketError: (error) => {
            console.error("WebSocket error:", error);
        },
    });

    client.activate();
}

function sendMessage(destination, body) {
    if (client && client.connected) {
        client.publish({
            destination: destination,
            body: JSON.stringify(body),
        });
    } else {
        console.error("Cannot send message. WebSocket is not connected.");
    }
}

export { initializeWebSocket, sendMessage };
