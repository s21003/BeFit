import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import NavBar from "../../components/NavBar";
import "../../styles/trainer/AddTrainerToTraining.css"

const AddTrainerToTraining = () => {
    const { trainingId } = useParams();
    const navigate = useNavigate();
    const [trainers, setTrainers] = useState([]);
    const [userTrainers, setUserTrainers] = useState([]);
    const [selectedTrainers, setSelectedTrainers] = useState([]);
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState(null);
    const [training, setTraining] = useState(null);

    const specializations = {
        "CARDIO": "Cardio",
        "SILOWY": "Siłowy",
        "CROSSFIT": "Crossfit",
        "FITNESS": "Fitness",
        "GRUPOWY": "Grupowy",
        "KLATKAPIERSIOWA": "Klatka Piersiowa",
        "BICEPS": "Biceps",
        "TRICEPS": "Triceps",
        "BRZUCH": "Brzuch",
        "PLECY": "Plecy",
        "BARKI": "Barki",
        "NOGI": "Nogi",
        "DIETETYK": "Dietetyk"
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");
            const decoded = jwtDecode(token);
            setUsername(decoded.sub);
        };
        fetchUserData();
    }, []);

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
                setUserId(data.id);
            } catch (error) {
                console.error("Fetching user by username failed: ", error);
            }
        };
        fetchUserId();
    }, [username]);

    useEffect(() => {
        if (!userId) return;

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
            const trainerId = selectedTrainers[0];

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

    const handleReturn = () => {
        navigate(`/all-trainings`);
    };

    return (
        <div className="add-trainer-page-container">
            <NavBar />
            <h2>Dodaj trenera do treningu</h2>
            <div className="add-trainer-page">
                <h3>Wybierz trenera:</h3>
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
                                <td>
                                    {trainer.specializations
                                        .map((spec) => specializations[spec] || spec)
                                        .join(', ')}
                                </td>
                                <td className="add-trainer-page-description-td">{trainer.description}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No accepted trainers available.</p>
                )}
            </div>

            <div className="add-trainer-page-buttons-container">
                <button className="add-trainer-page-add-btn" onClick={handleAddTrainers} >Zapisz trenera</button>
                <button className="add-trainer-page-return-btn" onClick={handleReturn}>Powrót</button>
            </div>
        </div>
    );
};

export default AddTrainerToTraining;
