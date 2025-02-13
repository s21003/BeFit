import React, { useState, useEffect, useContext } from 'react';
import Chat from '../chat/Chat';
import '../../styles/chat/ChatPage.css';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";
import NavBar from "../../components/NavBar";

function ChatPage() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const role = decodedToken.ROLE[0].authority;


    useEffect(() => {
        const fetchUsers = async () => {

            let user;

            try {
                const userDataResponse = await fetch(`http://localhost:8080/user/${decodedToken.sub}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                })
                if (!userDataResponse.ok) {
                    throw new Error(`HTTP error! status: ${userDataResponse.status}`);
                }
                user = await userDataResponse.json();
            } catch (error) {
                console.error("Fetching users failed: ", error);
            }

            try {
                let endpoint = '';
                if (role === 'TRAINER') {
                    console.log(token)
                    const trainerResponse = await fetch(`http://localhost:8080/trainer/username/${decodedToken.sub}`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    })
                    if (!trainerResponse.ok) {
                        throw new Error(`HTTP error! status: ${trainerResponse.status}`);
                    }
                    const trainerDataResponse = await trainerResponse.json();

                    endpoint = `http://localhost:8080/userTrainer/acceptedStudents/${trainerDataResponse.id}`;
                } else if (role === 'USER') {
                    endpoint = `http://localhost:8080/userTrainer/acceptedTrainers/${user.id}`;
                }

                console.log(endpoint)

                if (endpoint) {
                    const response = await fetch(endpoint, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const userTrainers = await response.json();
                    console.log("userTrainers: ", userTrainers);

                    const usersWithDetails = [];


                    for (let i = 0; i < userTrainers.length; i++) {
                        let id;
                        if(role === 'TRAINER') {
                            id = userTrainers[i].userId;
                            console.log(id)
                        } else if (role === 'USER') {
                            const trainer = await fetch(`http://localhost:8080/trainer/${userTrainers[i].trainerId}`, {
                                method: "GET",
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                    'Content-Type': 'application/json',
                                }
                            })
                            if (!trainer) {
                                throw new Error(`HTTP error! status: ${trainer.status}`);
                            }

                            const data = await trainer.json();

                            id = data.user.id;
                        }

                        const userTrainerDetails = await fetch(`http://localhost:8080/user/user/${id}`, {
                            method: 'GET',
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            }
                        })
                        if (!userTrainerDetails.ok) {
                            throw new Error(`Error fetching user details for ID: ${id}`);
                        }

                        const data = await userTrainerDetails.json();
                        usersWithDetails.push({
                            ...data,
                        });
                    }
                    setUsers(usersWithDetails);

                    if (usersWithDetails.length > 0) {
                        setSelectedUser(usersWithDetails);
                    }

                }
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    },[]);

    const handleUserSelect = (selectedUser) => {
        setSelectedUser(selectedUser);
    };

    if (!role) {
        return <div>Loading...</div>;
    }

    return (
        <div className="chat-page-container">
            <NavBar />
            <div className="users-list">
                <h2>{role === 'TRAINER'? 'Moi podopieczni': 'Moi trenerzy'}</h2>
                {isLoading? (
                    <div>Loading...</div>
                ): users.length > 0? (
                    <ul>
                        {users.map((person) => (
                            <li
                                key={person.id}
                                className={selectedUser?.id === person.id? 'selected': ''}
                                onClick={() => handleUserSelect(person)}
                            >
                                {person.name} {person.surname}
                            </li>
                        ))}
                    </ul>
                ): (
                    <p>Brak {role === 'TRAINER'? 'podopiecznych': 'trenerów'}.</p>
                )}
            </div>
            <div className="chat-area">
                {isLoading ? (<></>) : selectedUser? (
                    <>
                        <strong>{selectedUser.name} {selectedUser.surname}</strong>
                        <Chat receiverUsername={selectedUser.username} />
                    </>
                ) : (
                    <p>Select a {role === 'TRAINER'? 'student': 'trainer'} to start chatting.</p>
                )}
            </div>
        </div>
    );
}

export default ChatPage;