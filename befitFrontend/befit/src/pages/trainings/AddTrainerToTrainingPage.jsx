import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import NavBar from "../../components/NavBar";

const AddTrainerToTraining = () => {
    const { trainingId } = useParams();
    const navigate = useNavigate();
    const [trainers, setTrainers] = useState([]);
    const [userTrainers, setUserTrainers] = useState([]);
    const [selectedTrainers, setSelectedTrainers] = useState([]);
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState(null);
    const [training, setTraining] = useState(null);

    // Fetch the username from the decoded JWT token and fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");
            const decoded = jwtDecode(token);
            setUsername(decoded.sub);  // Username is used as the sub
        };
        fetchUserData();
    }, []);

    // Fetch userId based on the username
    useEffect(() => {
        if (!username) return;

        const fetchUserId = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch(`http://localhost:8080/user/${username}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setUserId(data.id);  // Set the userId once fetched
                console.log(userId)
            } catch (error) {
                console.error("Fetching user by username failed: ", error);
            }
        };
        fetchUserId();
    }, [username]);

    // Fetch accepted trainers based on userId
    useEffect(() => {
        if (!userId) return;

        console.log(userId)

        const fetchUserTrainers = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch(`http://localhost:8080/userTrainer/acceptedTrainers/${userId}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setUserTrainers(data);
            } catch (error) {
                console.error("Fetching user's trainers failed: ", error);
            }
        };
        fetchUserTrainers();
    }, [userId]);

    useEffect(() => {
        const fetchTrainers = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch('http://localhost:8080/trainer/all', {
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
                const acceptedTrainers = data.filter((trainer) =>
                    userTrainers.some((userTrainer) => userTrainer.trainerId === trainer.id && userTrainer.status === "ACCEPTED")
                );
                setTrainers(acceptedTrainers);
            } catch (error) {
                console.error("Fetching trainers failed: ", error);
            }
        };
        fetchTrainers();
    }, [userTrainers]);

    const handleCheckboxChange = (trainerId) => {
        setSelectedTrainers((prevSelected) => {
            if (prevSelected.includes(trainerId)) {
                return [];
            } else {
                return [trainerId];
            }
        });
    };

    useEffect(() => {
        const fetchTraining = async () => {
            const token = localStorage.getItem("token");
            try{
                const response = await fetch(`http://localhost:8080/training/${trainingId}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                })
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setTraining(data);
            }catch(err) {
                console.error('Failed to fetch training', err);
            }
        }
        fetchTraining();
    }, [trainingId]);


    const handleAddTrainers = async () => {
        if (selectedTrainers.length > 0) {
            const token = localStorage.getItem("token");
            console.log(selectedTrainers);
            const trainerId = selectedTrainers[0];
            console.log("trainerId: ",trainerId);
            console.log("training: ",training)

            try {
                const response = await fetch(`http://localhost:8080/training/addTrainer/${trainingId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({trainerId}),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                alert("Trenerzy zostali dodani do treningu.");
                navigate(`/all-trainings`);
            } catch (error) {
                console.error("Failed to add trainers: ", error);
            }
        } else {
            alert("Proszę wybrać przynajmniej jednego trenera.");
        }
    };


    // Handle return to the previous page
    const handleReturn = () => {
        navigate(`/all-trainings`);
    };

    return (
        <div className="add-trainer-page">
            <NavBar />
            <h2>Dodaj trenera do treningu</h2>

            <div className="trainer-selection">
                <h3>Wybierz trenerów:</h3>
                {trainers.length > 0 ? (
                    <table>
                        <thead>
                        <tr>
                            <th>Wybierz</th>
                            <th>Imię</th>
                            <th>Nazwisko</th>
                            <th>Adres</th>
                            <th>Specjalizacje</th>
                            <th>Opis</th>
                        </tr>
                        </thead>
                        <tbody>
                        {trainers.map((trainer) => (
                            <tr key={trainer.id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedTrainers.includes(trainer.id)}
                                        onChange={() => handleCheckboxChange(trainer.id)}
                                    />
                                </td>
                                <td>{trainer.user.name}</td>
                                <td>{trainer.user.surname}</td>
                                <td>{trainer.address}</td>
                                <td>{trainer.specializations.join(', ')}</td>
                                <td>{trainer.description}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No accepted trainers available.</p>
                )}
            </div>

            <div className="action-buttons">
                <button onClick={handleAddTrainers} disabled={selectedTrainers.length === 0}>Zapisz trenera</button>
                <button onClick={handleReturn}>Powrót</button>
            </div>
        </div>
    );
};

export default AddTrainerToTraining;
