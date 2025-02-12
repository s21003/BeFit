import React, { useState, useEffect, useRef } from "react";
import "../../styles/chat/Chat.css";
import { jwtDecode } from "jwt-decode";

function Chat({ receiverUsername }) {
    const [messages, setMessages] = useState([]);
    const [newMessageText, setNewMessageText] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [reconnectAttempts, setReconnectAttempts] = useState(0);

    const token = localStorage.getItem("token");
    const decodedToken = token ? jwtDecode(token) : null;
    const messageListRef = useRef(null);
    const eventSourceRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);

    useEffect(() => {
        if (!token || !receiverUsername || !decodedToken) return;

        let isFetchingHistory = true;

        const closeEventSource = () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                eventSourceRef.current = null;
                console.log("SSE connection closed");
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }
            setIsConnected(false);
        };

        const initEventSource = () => {
            const es = new EventSource(
                `http://localhost:8080/chat/chat-updates?token=${token}`
            );
            eventSourceRef.current = es;

            es.onopen = () => {
                console.log("SSE connection opened");
                setIsConnected(true);
                setReconnectAttempts(0);
                setError(null);
            };

            es.onmessage = (event) => {
                if (isFetchingHistory) return;
                try {
                    const newMessage = JSON.parse(event.data);
                    if (!newMessage || !newMessage.id || !newMessage.timestamp) return;
                    setMessages((prevMessages) => {
                        const exists = prevMessages.some((msg) => msg.id === newMessage.id);
                        return exists ? prevMessages : [...prevMessages, newMessage];
                    });
                } catch (jsonError) {
                    console.error("Error parsing SSE message:", jsonError);
                    setError("Error receiving message. Please try again later.");
                }
            };

            es.onerror = (error) => {
                console.error("SSE error:", error, es.readyState);
                if (es.readyState === EventSource.CLOSED) {
                    es.close();
                    setIsConnected(false);
                    if (reconnectAttempts < 5) {
                        const timeout = Math.pow(2, reconnectAttempts) * 1000;
                        console.log(
                            `Reconnecting attempt: ${reconnectAttempts + 1} in ${
                                timeout / 1000
                            }s`
                        );
                        reconnectTimeoutRef.current = setTimeout(initEventSource, timeout);
                        setReconnectAttempts((prev) => prev + 1);
                    } else {
                        setError("Failed to reconnect after multiple attempts.");
                    }
                }
            };

            es.addEventListener("close", () => {
                console.log("SSE connection closed");
                setIsConnected(false);
            });
        };

        const fetchHistoryAndConnect = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    `http://localhost:8080/chat/chat-history/${receiverUsername}`,
                    {
                        method: "GET",
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(
                        `HTTP error! status: ${response.status}, message: ${
                            errorData?.message || response.statusText
                        }`
                    );
                }
                const history = await response.json();
                setMessages(history);
                isFetchingHistory = false;
                initEventSource();
            } catch (error) {
                console.error("Error fetching history:", error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        setMessages([]);
        fetchHistoryAndConnect();

        return () => {
            closeEventSource();
            isFetchingHistory = true;
        };
    }, [receiverUsername, token]);

    useEffect(() => {
        if (messageListRef.current && messages.length > 0) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async () => {
        if (newMessageText.trim() === "" || !decodedToken) return;
        const messagePayload = {
            receiverUsername: receiverUsername,
            content: newMessageText.trim(),
        };
        try {
            const response = await fetch("http://localhost:8080/chat/send-message", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(messagePayload),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    `HTTP error! status: ${response.status}, message: ${
                        errorData?.message || response.statusText
                    }`
                );
            }
            const savedMessage = await response.json();
            setNewMessageText("");
            setMessages((prevMessages) => [...prevMessages, savedMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            setError(error.message);
        }
    };

    return (
        <div className="chat-container">
            {isLoading ? (
                <div className="loading">Loading...</div>
            ) : error ? (
                <div className="error">{error}</div>
            ) : (
                <div className="message-list" ref={messageListRef}>
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`message ${
                                msg.senderUsername === decodedToken?.sub ? "sender" : "receiver"
                            }`}
                        >
                            <div className="message-sender">
                                {msg.senderUsername === decodedToken?.sub ? null : (
                                    <span>{msg.senderUsername}</span>
                                )}
                            </div>
                            <div className="message-content">
                                <p>{msg.content}</p>
                            </div>
                            <div className="message-timestamp">
                                {new Date(msg.timestamp).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className="message-input">
                <input
                    className="chat-input"
                    type="text"
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    placeholder="Napisz wiadomość..."
                />
                <button
                    className="chat-send-btn"
                    onClick={sendMessage}
                    disabled={!token || !receiverUsername || !decodedToken || isLoading}
                >
                    Wyślij
                </button>
            </div>
        </div>
    );
}

export default Chat;