import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import "../../styles/stundent/OwnStundentsPage.css"

const OwnStudentPage = () => {
    const [students, setStudents] = useState([]);
    const [userTrainer, setUserTrainer] = useState([]);
    const [requests, setRequests] = useState([]);
    const [sortedRequests, setSortedRequests] = useState({
        pending: [],
        accepted: [],
        rejected: [],
    });
    const [selectedTab, setSelectedTab] = useState("pending");
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const getTrainerIdFromUsername = async (username) => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:8080/trainer/username/${username}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching trainer: ", error);
            return null;
        }
    };

    useEffect(() => {
        const fetchAcceptedStudents = async () => {
            const token = localStorage.getItem("token");
            const decodedToken = jwtDecode(token);
            const trainerUsername = decodedToken.sub;

            const trainer = await getTrainerIdFromUsername(trainerUsername);

            if (trainer) {
                const trainerId = trainer.id;
                try {
                    const response = await fetch(`http://localhost:8080/userTrainer/acceptedStudents/${trainerId}`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    setUserTrainer(data);
                    setIsLoading(false);
                } catch (error) {
                    console.error("Error fetching accepted students: ", error);
                    setIsLoading(false);
                }
            } else {
                console.error("Failed to fetch trainer data.");
                setIsLoading(false);
            }
        };

        fetchAcceptedStudents();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (userTrainer.length > 0) {
            const fetchStudents = async () => {
                try {
                    const newStudents = [];
                    for (let i = 0; i < userTrainer.length; i++) {
                        const userId = userTrainer[i].userId;

                        const response = await fetch(`http://localhost:8080/user/user/${userId}`, {
                            method: 'GET',
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            },
                        });

                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }

                        const data = await response.json();
                        const trainerData = userTrainer.find((trainer) => trainer.userId === userId);
                        if (trainerData) {
                            data.timestamp = trainerData.timestamp;  // Add timestamp from userTrainer
                        }
                        newStudents.push(data);
                    }
                    setStudents(newStudents);
                } catch (error) {
                    console.error("Fetching students failed: ", error);
                }
            };

            fetchStudents();
        }
    }, [userTrainer]);

    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchRequests = async () => {
            const decodedToken = jwtDecode(token);
            const trainerUsername = decodedToken.sub;

            const trainer = await getTrainerIdFromUsername(trainerUsername);

            if (trainer) {
                const trainerId = trainer.id;
                try {
                    const response = await fetch(`http://localhost:8080/userTrainer/trainerRequests/${trainerId}`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();

                    const requestsWithUserDetails = await Promise.all(data.map(async (request) => {
                        const userResponse = await fetch(`http://localhost:8080/user/user/${request.userId}`, {
                            method: 'GET',
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            },
                        });

                        if (!userResponse.ok) {
                            throw new Error(`Error fetching user details for request ID ${request.id}`);
                        }

                        const userData = await userResponse.json();
                        // Add user details to the request object
                        return { ...request, user: userData };
                    }));
                    setRequests(requestsWithUserDetails);
                    setIsLoading(false);
                } catch (error) {
                    console.error("Error fetching requests: ", error);
                    setIsLoading(false);
                }
            }
        };
        fetchRequests();
    }, []);

    useEffect(() => {
        const sorted = {
            pending: [],
            accepted: [],
            rejected: [],
        };

        requests.forEach((request) => {
            if (request.status === "PENDING") {
                sorted.pending.push(request);
            } else if (request.status === "ACCEPTED") {
                sorted.accepted.push(request);
            } else if (request.status === "REJECTED") {
                sorted.rejected.push(request);
            }
        });

        setSortedRequests(sorted);
    }, [requests]);

    const handleTabChange = (tab) => {
        setSelectedTab(tab);
    };

    const handleRequestStatusChange = async (requestId, status) => {
        const token = localStorage.getItem("token");

        try {
            // Update the request status in the backend
            const response = await fetch(`http://localhost:8080/userTrainer/updateRequest/${requestId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            // Show the alert with the status change message
            alert(`Request has been ${status.toLowerCase()}.`);

            // Refresh the page to update the list of requests and students
            window.location.reload();  // This reloads the entire page
        } catch (error) {
            console.error("Error updating request status: ", error);
            alert("Failed to update the request status.");
        }
    };

    const handleViewDetails = (userName) => {
        navigate(`/details-student/${userName}`);
    };

    const handleDeleteStudent = async (studentId) => {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        const trainerUsername = decodedToken.sub;

        const trainer = await getTrainerIdFromUsername(trainerUsername);

        const trainerPayLoad = {
            trainerId: trainer.id,
        }

        try {
            const response = await fetch(`http://localhost:8080/userTrainer/deleteStudent/${studentId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(trainerPayLoad)
            });

            if (response.ok) {
                alert('Pomyślnie usunięto podopiecznego.');
                window.location.reload();
            } else {
                throw new Error('Failed to delete student');
            }
        } catch (error) {
            console.error("Error deleting student: ", error);
            alert("Nie udało się usunąć podopiecznego.");
        }
    };

    if (isLoading) {
        return <p>Loading students and requests...</p>;
    }

    return (
        <div className="ownStudentsPage-container">
            <NavBar />
            <h1>Moi podopieczni</h1>
            <div className="ownStudentsPage">
                <div className="ownStudents">
                    <h2>Podopieczni</h2>
                    {students.length > 0 ? (
                        <table>
                            <thead>
                            <tr>
                                <th>Imię</th>
                                <th>Nazwisko</th>
                                <th>Adres</th>
                                <th>Współpraca od</th>
                                <th>Zakończ współpracę</th>
                            </tr>
                            </thead>
                            <tbody>
                            {students.map((student) => (
                                <tr key={student.id} onClick={() => handleViewDetails(student.username)} style={{cursor: 'pointer'}}> {/* Added onClick and cursor style */}
                                    <td>{student.name}</td>
                                    <td>{student.surname}</td>
                                    <td>{student.address}</td>
                                    <td>{new Date(student.timestamp).toLocaleDateString()}</td>
                                    <td className="ownStudents-delete">
                                        <button className="ownStudents-btn-delete" onClick={() => handleDeleteStudent(student.id)}>Zakończ</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Brak podopiecznych.</p>
                    )}
                </div>

                <div className="requestsContainer">
                    <h2>Prośby o współprace</h2>
                    <div className="requestsContainer-tabs">
                        <button
                            className={selectedTab === "pending" ? "requestsContainer-active" : ""}
                            onClick={() => handleTabChange("pending")}
                        >
                            W toku
                        </button>
                        <button
                            className={selectedTab === "accepted" ? "requestsContainer-active" : ""}
                            onClick={() => handleTabChange("accepted")}
                        >
                            Zaakceptowane
                        </button>
                        <button
                            className={selectedTab === "rejected" ? "requestsContainer-active" : ""}
                            onClick={() => handleTabChange("rejected")}
                        >
                            Odrzucone
                        </button>
                    </div>

                    <div className="requestsList">
                        {isLoading ? ( // Display loading message
                            <p>Loading requests...</p>
                        ) : sortedRequests[selectedTab]?.length > 0 ? (
                            <ul>
                                {sortedRequests[selectedTab].map((request) => (
                                    <li key={request.id}>
                                        {request.status === "PENDING" ? (
                                            <div>
                                                <div className="studentsInfo">
                                                    <strong>Imie:</strong>
                                                    <div>{request.user.name}</div>
                                                    <strong>Nazwisko:</strong>
                                                    <div>{request.user.surname}</div>
                                                    <strong>Adres:</strong>
                                                    <div>{request.user.address}</div>
                                                </div>
                                                <div className="requestsList-buttons-container">
                                                    <button
                                                        className="requestsList-accept-btn"
                                                        onClick={() => handleRequestStatusChange(request.id, "ACCEPTED")}
                                                    >
                                                        Zaakceptuj
                                                    </button>
                                                    <button
                                                        className="requestsList-reject-btn"
                                                        onClick={() => handleRequestStatusChange(request.id, "REJECTED")}
                                                    >
                                                        Odrzuć
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="studentsInfo">
                                                    <strong>Imię:</strong>
                                                    <div>{request.user.name} </div>
                                                    <strong>Nazwisko:</strong>
                                                    <div>{request.user.surname} </div>
                                                    <strong>Adres:</strong>
                                                    <div>{request.user.address}</div>
                                                </div>
                                                <div>
                                                    <strong>
                                                        {request.status === "ACCEPTED" ? "Zaakceptowano:" : "Odrzucono:"}
                                                    </strong>{" "}
                                                    {new Date(request.timestamp).toLocaleDateString()}
                                                </div>
                                            </div>

                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Brak próśb.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnStudentPage;
