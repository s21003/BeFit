import React, { useState, useEffect, useRef, useCallback } from 'react';

function ConnectedUsers({ sessionId }) {
    const [users, setUsers] = useState([]);
    const nodeRef = useRef(null);

    const fetchConnectedUsers = useCallback(() => {
        fetch('http://localhost:8080/connected-users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(sessionId),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Błąd sieci');
                }
                return response.json();
            })
            .then(data => {
                setUsers(data);
            })
            .catch(error => console.error('Error fetching connected users:', error));
    }, [sessionId]);

    useEffect(() => {
        fetchConnectedUsers();

        const intervalId = setInterval(fetchConnectedUsers, 5000);

        return () => {
            clearInterval(intervalId);
        };
    }, [fetchConnectedUsers]);

    return (
            <div className="connected-users" ref={nodeRef}>
                <h2>Podłączeni użytkownicy</h2>
                <ul>
                    {users.map((user) => (
                        <li key={user.username}>{user.username}</li>
                    ))}
                </ul>
                <button onClick={fetchConnectedUsers}>Odśwież</button>
            </div>
    );
}

export default ConnectedUsers;