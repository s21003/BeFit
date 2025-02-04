import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import NavBar from "../../components/NavBar";
import "../../styles/items/OwnItemsPage.css"

const OwnExercisesPage = () => {
    const navigate = useNavigate();
    const [ownExercises, setOwnExercises] = useState([]);

    useEffect(() => {
        const fetchOwnExercises = async () => {
            const token = localStorage.getItem("token");

            if (token) {
                const decodedToken = jwtDecode(token);
                const creatorUsername = decodedToken.sub;

                console.log("User username from token:", creatorUsername, "   ", token);

                try {
                    const response = await fetch(`http://localhost:8080/exercise/user/${creatorUsername}`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    console.log(data);
                    setOwnExercises(data);
                } catch (error) {
                    console.error("Fetching own exercises failed: ", error);
                }
            } else {
                console.error("No token found, please login again.");
                navigate('/login');
            }
        };
        fetchOwnExercises();
    }, []);

    const handleRowClick = (exerciseId) => {
        navigate(`/exercise/${exerciseId}`);
    };

    const handleVideoClick = (videoLink) => {
        // Open the video link in a new tab if it exists
        if (videoLink) {
            window.open(videoLink, "_blank");
        }
    };

    const handleAddExercise = () => {
        navigate(`/add-exercise`);
    }

    const handleReturn = () => {
        navigate(`/all-trainings`);
    }

    const parts = {  // Correct mapping: Display Name -> Enum Value
        "Klatka piersiowa": "KLATKAPIERSIOWA",
        "Biceps": "BICEPS",
        "Triceps": "TRICEPS",
        "Brzuch": "BRZUCH",
        "Plecy": "PLECY",
        "Barki": "BARKI",
        "Nogi": "NOGI",
        "Cardio": "CARDIO",
    };

    const reverseParts = Object.fromEntries( // Create Reverse Mapping: Enum Value -> Display Name
        Object.entries(parts).map(([key, value]) => [value, key])
    );

    return (
        <div className="ownItems-container">
            <NavBar/>
            <div className="ownItems">
                <h2 className="ownHeader">Twoje ćwiczenia</h2>
                {ownExercises.length > 0 ? (
                    <div className="ownItems-table">
                        <table>
                            <thead>
                            <tr>
                                <th>Nazwa</th>
                                <th>Partia</th>
                                <th>Link do wideo</th>
                            </tr>
                            </thead>
                            <tbody>
                            {ownExercises.map(exercise => (
                                <tr key={exercise.id} onClick={() => handleRowClick(exercise.id)}>
                                    <td>{exercise.name}</td>
                                    <td>{reverseParts[exercise.part] || exercise.part}</td>
                                    <td>
                                        {exercise.videoLink && (
                                            <button className="btn-video"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent row click
                                                        handleVideoClick(exercise.videoLink);
                                                    }}
                                            >
                                                Zobacz wideo
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>Brak własnych ćwiczeń.</p>

                )}
                <div className="ownItems-buttons-container">
                    <button className="ownItems-add-btn" onClick={handleAddExercise}>Dodaj ćwiczenie</button>
                    <button className="ownItems-return-btn" onClick={handleReturn}>Powrót</button>
                </div>
            </div>
        </div>
    );
};

export default OwnExercisesPage;
